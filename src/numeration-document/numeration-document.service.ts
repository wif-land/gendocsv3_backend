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
import { DocumentEntity } from '../documents/entities/document.entity'
import { NumerationByCouncil } from './dto/numeration-by-council.dto'
import { CouncilAttendanceRole } from '../councils/interfaces/council-attendance.interface'

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
      const council = await this.councilRepository.findOne({
        where: { id: createNumerationDocumentDto.councilId },
      })

      if (!council) {
        throw new BadRequestException('Council not found')
      }

      const hasPresident = council.attendance.find(
        (a) => a.role === CouncilAttendanceRole.PRESIDENT,
      )

      if (!hasPresident) {
        throw new BadRequestException(
          'El consejo no tiene un presidente asignado',
        )
      }

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
          numerationsByCouncil &&
          numerationsByCouncil[0].state === NumerationState.USED &&
          numerationsByCouncil[0].number === createNumerationDocumentDto.number
        ) {
          throw new BadRequestException('El número ya está en uso')
        }

        if (
          !numerationsByCouncil ||
          numerationsByCouncil.length === 0 ||
          // eslint-disable-next-line no-extra-parens
          (numerationsByYearModule[0].council.id ===
            createNumerationDocumentDto.councilId &&
            numerationsByYearModule[0].number <
              createNumerationDocumentDto.number)
        ) {
          if (
            (!numerationsByCouncil || numerationsByCouncil.length === 0) &&
            createNumerationDocumentDto.number <=
              numerationsByYearModule[0].number
          ) {
            throw new BadRequestException(
              'El número ya es parte de la numeración de otro consejo o ya está en uso',
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

          if (
            !availableCounsilNumeration ||
            availableCounsilNumeration.length === 0
          ) {
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
      if (error.status) throw new BadRequestException(error.message)

      throw new Error(error.message)
    }
  }

  async documentRemoved(document: DocumentEntity) {
    try {
      const numeration = await this.numerationDocumentRepository.findOneOrFail({
        where: { id: document.numerationDocument.id },
      })

      return await this.numerationDocumentRepository.update(numeration.id, {
        state: NumerationState.ENQUEUED,
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getNumerationByCouncil(councilId: number) {
    try {
      let nextAvailableNumber = -1
      const reservedNumbers = []
      const enqueuedNumbers = []
      const usedNumbers = []

      const council = await this.councilRepository.findOne({
        where: { id: councilId },
        relations: ['submoduleYearModule', 'submoduleYearModule.yearModule'],
      })

      if (!council) {
        throw new BadRequestException('Council not found')
      }

      const numeration = await this.numerationDocumentRepository.find({
        where: { council: { id: councilId } },
        order: { number: 'ASC' },
      })

      if (numeration) {
        numeration.forEach((numeration) => {
          switch (numeration.state) {
            case NumerationState.RESERVED:
              reservedNumbers.push(numeration.number)
              break
            case NumerationState.ENQUEUED:
              enqueuedNumbers.push(numeration.number)
              break
            case NumerationState.USED:
              usedNumbers.push(numeration.number)
              break
          }
        })
      }

      const numerationByYearModule =
        await this.numerationDocumentRepository.find({
          where: {
            yearModule: { id: council.submoduleYearModule.yearModule.id },
          },
          order: { number: 'DESC' },
        })

      if (numerationByYearModule.length > 0) {
        if (numerationByYearModule[0].council.id === councilId) {
          nextAvailableNumber = numerationByYearModule[0].number + 1
        } else {
          if (enqueuedNumbers.length > 0) {
            nextAvailableNumber = enqueuedNumbers[0]
          } else if (reservedNumbers.length > 0) {
            nextAvailableNumber = reservedNumbers[0]
          } else {
            nextAvailableNumber = -1
          }
        }
      } else {
        nextAvailableNumber = 1
      }

      const NumerationByCouncil: NumerationByCouncil = {
        nextAvailableNumber,
        reservedNumbers,
        enqueuedNumbers,
        usedNumbers,
      }

      return NumerationByCouncil
    } catch (error) {
      if (error.status) throw new BadRequestException(error.message)

      throw new InternalServerErrorException(error.message)
    }
  }

  findAll() {
    return `This action returns all numerationDocument`
  }

  async findOne(id: number) {
    try {
      return await this.numerationDocumentRepository.findOneOrFail({
        where: { id },
        relations: ['council'],
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  update(id: number, updateNumerationDocumentDto: UpdateNumerationDocumentDto) {
    return `This action updates a #${id} numerationDocument${updateNumerationDocumentDto}`
  }

  async remove(id: number) {
    try {
      return await this.numerationDocumentRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
