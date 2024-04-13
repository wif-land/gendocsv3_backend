import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateNumerationDocumentDto } from './dto/create-numeration-document.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { NumerationDocumentEntity } from './entities/numeration-document.entity'
import { CouncilEntity } from '../councils/entities/council.entity'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { NumerationState } from '../shared/enums/numeration-state'
import { DocumentEntity } from '../documents/entities/document.entity'
import { NumerationByCouncil } from './dto/numeration-by-council.dto'
import { CouncilAttendanceRole } from '../councils/interfaces/council-attendance.interface'
import { ApiResponse } from '../shared/interfaces/response.interface'

@Injectable()
export class NumerationDocumentService {
  constructor(
    @InjectRepository(NumerationDocumentEntity)
    private readonly numerationDocumentRepository: Repository<NumerationDocumentEntity>,
    @InjectRepository(CouncilEntity)
    private readonly councilRepository: Repository<CouncilEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async verifyCouncilExists(
    councilId: number,
  ): Promise<ApiResponse<CouncilEntity>> {
    const council = await this.dataSource.manager.findOne(CouncilEntity, {
      where: { id: councilId },
    })

    if (!council) throw new BadRequestException('Council not found')
    return {
      message: 'Consejo encontrado exitosamente',
      data: council,
    }
  }

  async validateCouncilPresident(council: CouncilEntity) {
    const hasPresident = council.attendance.find(
      (a) => a.role === CouncilAttendanceRole.PRESIDENT,
    )
    if (!hasPresident) {
      throw new BadRequestException(
        'El consejo no tiene un presidente asignado',
      )
    }
  }

  async getYearModule(
    council: CouncilEntity,
  ): Promise<ApiResponse<YearModuleEntity>> {
    const year = new Date().getFullYear()

    const qb = this.dataSource.manager
      .createQueryBuilder(YearModuleEntity, 'year_module')
      .leftJoinAndSelect('year_module.module', 'module')
    qb.where('year_module.year = :year', { year })
    qb.andWhere('year_module.module.id = :moduleId', {
      moduleId: council.module.id,
    })
    const yearModule = await qb.getOne()

    if (!yearModule) {
      throw new BadRequestException('YearModule not found')
    }

    return {
      message: 'Módulo del año encontrado exitosamente',
      data: yearModule,
    }
  }

  async createLastNumeration(
    numeration: number,
    councilId: number,
    yearModuleId: number,
  ): Promise<ApiResponse<NumerationDocumentEntity>> {
    const numerationDocument = this.dataSource.manager.create(
      NumerationDocumentEntity,
      {
        number: numeration,
        state: NumerationState.USED,
        council: { id: councilId },
        yearModule: { id: yearModuleId },
      },
    )

    const numerationDocumentSaved = await this.dataSource.manager.save(
      numerationDocument,
    )

    if (!numerationDocumentSaved) {
      throw new InternalServerErrorException('Error al crear la numeración')
    }

    return {
      message: 'Numeración creada exitosamente',
      data: numerationDocumentSaved,
    }
  }

  async reserveNumerationRange(
    start: number,
    end: number,
    councilId: number,
    yearModuleId: number,
  ) {
    try {
      for (let i = start; i < end; i++) {
        const numerationDocument = this.dataSource.manager.create(
          NumerationDocumentEntity,
          {
            number: i,
            state: NumerationState.RESERVED,
            council: { id: councilId },
            yearModule: { id: yearModuleId },
          },
        )
        await this.dataSource.manager.save(numerationDocument)
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  verifyNumerationUsed(
    numeration: number,
    numerations: NumerationDocumentEntity[],
  ) {
    if (
      numerations &&
      numerations[0].state === NumerationState.USED &&
      numerations[0].number === numeration
    ) {
      throw new BadRequestException('El número ya está en uso')
    }
  }

  async getAvailableCouncilNumeration(
    councilId: number,
  ): Promise<ApiResponse<NumerationDocumentEntity[]>> {
    const qb = this.dataSource.manager
      .createQueryBuilder(NumerationDocumentEntity, 'numeration_document')
      .leftJoinAndSelect('numeration_document.council', 'council')
    qb.where('numeration_document.council.id = :councilId', {
      councilId,
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

    return {
      message: 'Numeración disponible encontrada exitosamente',
      data: availableCounsilNumeration,
    }
  }

  async create(createNumerationDocumentDto: CreateNumerationDocumentDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const { data: council } = await this.verifyCouncilExists(
        createNumerationDocumentDto.councilId,
      )

      await this.validateCouncilPresident(council)

      const { data: yearModule } = await this.getYearModule(council)

      const numerationsByYearModule = await this.dataSource.manager.find(
        NumerationDocumentEntity,
        {
          where: { yearModule: { id: yearModule.id } },
          order: { number: 'DESC' },
        },
      )

      if (!numerationsByYearModule || numerationsByYearModule.length === 0) {
        if (createNumerationDocumentDto.number > 1) {
          await this.reserveNumerationRange(
            1,
            createNumerationDocumentDto.number,
            createNumerationDocumentDto.councilId,
            yearModule.id,
          )
        }

        return await this.createLastNumeration(
          createNumerationDocumentDto.number,
          createNumerationDocumentDto.councilId,
          yearModule.id,
        )
      } else {
        const numerationsByCouncil = await this.dataSource.manager.find(
          NumerationDocumentEntity,
          {
            where: { council: { id: createNumerationDocumentDto.councilId } },
            order: { number: 'DESC' },
          },
        )

        this.verifyNumerationUsed(
          createNumerationDocumentDto.number,
          numerationsByCouncil,
        )

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
          !numerationsByCouncil ||
          numerationsByCouncil.length === 0 ||
          // eslint-disable-next-line no-extra-parens
          (numerationsByYearModule[0].council.id ===
            createNumerationDocumentDto.councilId &&
            numerationsByYearModule[0].number <
              createNumerationDocumentDto.number)
        ) {
          if (
            createNumerationDocumentDto.number >
            numerationsByYearModule[0].number + 1
          ) {
            await this.reserveNumerationRange(
              numerationsByYearModule[0].number + 1,
              createNumerationDocumentDto.number,
              createNumerationDocumentDto.councilId,
              yearModule.id,
            )
          }

          return await this.createLastNumeration(
            createNumerationDocumentDto.number,
            createNumerationDocumentDto.councilId,
            yearModule.id,
          )
        } else {
          const { data: availableCouncilNumeration } =
            await this.getAvailableCouncilNumeration(
              createNumerationDocumentDto.councilId,
            )

          if (
            createNumerationDocumentDto.number <=
            availableCouncilNumeration[0].number
          ) {
            throw new BadRequestException(
              'El número ya es parte de la numeración de otro consejo',
            )
          }

          const numerationDocument = availableCouncilNumeration.find(
            (numeration) =>
              numeration.number === createNumerationDocumentDto.number,
          )

          numerationDocument.state = NumerationState.USED

          const entity = await this.dataSource.manager.save(
            NumerationDocumentEntity,
            numerationDocument,
          )

          return {
            message: 'Numeración creada exitosamente',
            data: entity,
          }
        }
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()

      if (error.status) throw new HttpException(error.message, error.status)

      throw new Error(error.message)
    } finally {
      await queryRunner.release()
    }
  }

  async documentRemoved(document: DocumentEntity): Promise<ApiResponse> {
    try {
      const numeration = await this.numerationDocumentRepository.findOneOrFail({
        where: { id: document.numerationDocument.id },
      })

      const documentDeleted = await this.numerationDocumentRepository.update(
        numeration.id,
        {
          state: NumerationState.ENQUEUED,
        },
      )

      if (!documentDeleted) {
        throw new BadRequestException('Error al eliminar el documento')
      }

      return {
        message: 'Documento eliminado exitosamente',
        data: {
          success: true,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getNumerationByCouncil(
    councilId: number,
  ): Promise<ApiResponse<NumerationByCouncil>> {
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

      return {
        message: 'Numeración por consejo encontrada exitosamente',
        data: NumerationByCouncil,
      }
    } catch (error) {
      if (error.status) throw new BadRequestException(error.message)

      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number): Promise<ApiResponse<NumerationDocumentEntity>> {
    try {
      const numerationDocument =
        await this.numerationDocumentRepository.findOneOrFail({
          where: { id },
          relations: ['council'],
        })

      return {
        message: 'Numeración encontrada exitosamente',
        data: numerationDocument,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number): Promise<ApiResponse> {
    try {
      const numerationDeleted = await this.numerationDocumentRepository.delete(
        id,
      )

      if (!numerationDeleted) {
        throw new BadRequestException('Error al eliminar la numeración')
      }

      return {
        message: 'Numeración eliminada exitosamente',
        data: {
          success: true,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
