import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateNumerationDocumentDto } from './dto/create-numeration-document.dto'
import { UpdateNumerationDocumentDto } from './dto/update-numeration-document.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { NumerationDocumentEntity } from './entities/numeration-document.entity'
import { CouncilEntity } from '../councils/entities/council.entity'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { NumerationState } from '../shared/enums/numeration-state'

@Injectable()
export class NumerationDocumentService {
  constructor(
    @InjectRepository(NumerationDocumentEntity)
    private readonly numerationDocumentRepository: Repository<NumerationDocumentEntity>,
    @InjectRepository(CouncilEntity)
    private readonly councilRepository: Repository<CouncilEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createNumerationDocumentDto: CreateNumerationDocumentDto) {
    try {
      const council = await this.councilRepository.findOneOrFail({
        where: { id: createNumerationDocumentDto.councilId },
      })
      const year = new Date().getFullYear()
      const qb = this.dataSource
        .createQueryBuilder(YearModuleEntity, 'year_module')
        .leftJoinAndSelect('year_module.module', 'module')
      qb.where('year_module.year = :year', { year })
      qb.andWhere('year_module.module.id = :moduleId', {
        moduleId: council.module.id,
      })

      const yearModule = await qb.getOneOrFail()

      const numerationsByYearModule =
        await this.numerationDocumentRepository.find({
          where: { yearModule: { id: yearModule.id } },
          order: { number: 'DESC' },
        })

      if (!numerationsByYearModule || numerationsByYearModule.length === 0) {
        if (createNumerationDocumentDto.number > 1) {
          for (let i = 1; i < createNumerationDocumentDto.number; i++) {
            const numerationDocument = this.numerationDocumentRepository.create(
              {
                number: i,
                state: NumerationState.RESERVED,
                council: { id: createNumerationDocumentDto.councilId },
                yearModule: { id: yearModule.id },
              },
            )
            await this.numerationDocumentRepository.save(numerationDocument)
          }
        }

        const numerationDocument = this.numerationDocumentRepository.create({
          number: createNumerationDocumentDto.number,
          state: NumerationState.USED,
          council: { id: createNumerationDocumentDto.councilId },
          yearModule: { id: yearModule.id },
        })

        return await this.numerationDocumentRepository.save(numerationDocument)
      } else {
        const numerationsByCouncil =
          await this.numerationDocumentRepository.find({
            where: { council: { id: createNumerationDocumentDto.councilId } },
            order: { number: 'DESC' },
          })

        if (
          !numerationsByCouncil ||
          numerationsByCouncil.length === 0 ||
          // eslint-disable-next-line no-extra-parens
          (numerationsByYearModule[0].council.id ===
            createNumerationDocumentDto.councilId &&
            numerationsByYearModule[0].number <=
              createNumerationDocumentDto.number)
        ) {
          if (
            createNumerationDocumentDto.number <=
            numerationsByYearModule[0].number
          ) {
            throw new BadRequestException(
              'El número ya es parte de la numeración de otro consejo',
            )
          }

          if (
            createNumerationDocumentDto.number >
            numerationsByYearModule[0].number + 1
          ) {
            for (
              let i = numerationsByYearModule[0].number + 1;
              i < createNumerationDocumentDto.number;
              i++
            ) {
              const numerationDocument =
                this.numerationDocumentRepository.create({
                  number: i,
                  state: NumerationState.RESERVED,
                  council: { id: createNumerationDocumentDto.councilId },
                  yearModule: { id: yearModule.id },
                })
              await this.numerationDocumentRepository.save(numerationDocument)
            }
          }

          const numerationDocument = this.numerationDocumentRepository.create({
            number: createNumerationDocumentDto.number,
            state: NumerationState.USED,
            council: { id: createNumerationDocumentDto.councilId },
            yearModule: { id: yearModule.id },
          })

          return await this.numerationDocumentRepository.save(
            numerationDocument,
          )
        } else {
          const qb = this.dataSource
            .createQueryBuilder(NumerationDocumentEntity, 'numeration_document')
            .leftJoinAndSelect('numeration_document.council', 'council')
          qb.where('numeration_document.council.id = :councilId', {
            councilId: createNumerationDocumentDto.councilId,
          })
          qb.andWhere('numeration_document.state <> :state', {
            state: NumerationState.USED,
          })
          const availableCounsilNumeration = await qb.getMany()

          if (availableCounsilNumeration.length === 0) {
            throw new BadRequestException(
              'No hay números disponibles para el consejo y los siguientes se encuentran en uso',
            )
          }

          if (
            createNumerationDocumentDto.number <=
            availableCounsilNumeration[0].number
          ) {
            throw new BadRequestException(
              'El número ya es parte de la numeración de otro consejo',
            )
          }

          const numerationDocument = availableCounsilNumeration.find(
            (numeration) =>
              numeration.number === createNumerationDocumentDto.number,
          )

          numerationDocument.state = NumerationState.USED

          return await this.numerationDocumentRepository.save(
            numerationDocument,
          )
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  findAll() {
    return `This action returns all numerationDocument`
  }

  findOne(id: number) {
    return `This action returns a #${id} numerationDocument`
  }

  update(id: number, updateNumerationDocumentDto: UpdateNumerationDocumentDto) {
    return `This action updates a #${id} numerationDocument${updateNumerationDocumentDto}`
  }

  remove(id: number) {
    return `This action removes a #${id} numerationDocument`
  }
}
