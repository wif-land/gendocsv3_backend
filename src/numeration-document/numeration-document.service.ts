import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateNumerationDocumentDto } from './dto/create-numeration-document.dto'
import { InjectRepository } from '@nestjs/typeorm'
import {
  DataSource,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm'
import { NumerationDocumentEntity } from './entities/numeration-document.entity'
import { CouncilEntity } from '../councils/entities/council.entity'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { NumerationState } from '../shared/enums/numeration-state'
import { DocumentEntity } from '../documents/entities/document.entity'
import { NumerationByCouncil } from './dto/numeration-by-council.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { NumerationConflict } from './errors/numeration-conflict'
import { NumerationBadRequest } from './errors/numeration-bad-request'
import { YearModuleService } from '../year-module/year-module.service'

@Injectable()
export class NumerationDocumentService {
  constructor(
    @InjectRepository(NumerationDocumentEntity)
    private readonly numerationDocumentRepository: Repository<NumerationDocumentEntity>,
    @InjectRepository(CouncilEntity)
    private readonly councilRepository: Repository<CouncilEntity>,

    private readonly yearModuleService: YearModuleService,
    private readonly dataSource: DataSource,
  ) {}

  async verifyCouncilExists(councilId: number) {
    const council = await this.dataSource.manager.findOne(CouncilEntity, {
      where: { id: councilId },
    })

    if (!council) throw new NumerationBadRequest('Council not found')
    return new ApiResponseDto('Consejo encontrado exitosamente', council)
  }

  async validateCouncilPresident(council: CouncilEntity) {
    const hasPresident = council.attendance.find((a) => a.isPresident)
    if (!hasPresident) {
      throw new NumerationBadRequest(
        'El consejo no tiene un presidente asignado',
      )
    }
  }

  async getYearModule(council: CouncilEntity) {
    const year = await this.yearModuleService.getCurrentSystemYear()

    const yearModule = await this.dataSource.manager.findOne(YearModuleEntity, {
      where: { year, module: { id: council.module.id } },
    })

    if (!yearModule) {
      throw new NumerationConflict('YearModule not found')
    }

    return new ApiResponseDto(
      'Módulo del año encontrado exitosamente',
      yearModule,
    )
  }

  async createLastNumeration(
    numeration: number,
    councilId: number,
    yearModuleId: number,
  ) {
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

    return new ApiResponseDto(
      'Numeración creada exitosamente',
      numerationDocumentSaved,
    )
  }

  async reserveNumerationRange(
    start: number,
    end: number,
    councilId: number,
    yearModuleId: number,
  ) {
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
      const numerations = await this.dataSource.manager.save(numerationDocument)

      if (!numerations) {
        throw new NumerationConflict(
          'Se produjo un conflicto al reservar la numeración',
        )
      }
    }
  }

  async reserveNumeration(
    start: number,
    end: number,
    councilId: number,
    isExtension?: boolean,
  ) {
    if (isExtension) {
      const council = await this.dataSource.manager.findOne(CouncilEntity, {
        where: { id: councilId },
      })
      const yearModule = await this.getYearModule(council)
      const numerations = await this.dataSource.manager.find(
        NumerationDocumentEntity,
        {
          where: {
            council: { id: councilId },
            yearModule: { id: yearModule.data.id },
          },
          order: { number: 'DESC' },
        },
      )

      if (!numerations || numerations.length === 0) {
        throw new NumerationBadRequest(
          'No hay numeración reservada para el consejo',
        )
      }

      if (start <= numerations[0].number) {
        const prevCouncilNumerations = await this.dataSource.manager.findOne(
          NumerationDocumentEntity,
          {
            where: {
              council: { id: Not(councilId) },
              state: NumerationState.RESERVED,
              number: numerations[0].number - 1,
            },
          },
        )

        if (!prevCouncilNumerations || prevCouncilNumerations === null) {
          throw new NumerationBadRequest(
            'El rango de numeración solicitado para ampliarse ya está en uso',
          )
        }

        const lastPrevCouncilNumerationUsedOrEnqueued =
          await this.dataSource.manager.findOne(NumerationDocumentEntity, {
            where: {
              council: { id: prevCouncilNumerations.council.id },
              state: Not(NumerationState.RESERVED),
              number: LessThan(numerations[0].number),
            },
            order: { number: 'DESC' },
          })

        if (
          !lastPrevCouncilNumerationUsedOrEnqueued ||
          lastPrevCouncilNumerationUsedOrEnqueued === null
        ) {
          const reasignedNumerations = await this.reasignNumerations(
            numerations,
            councilId,
          )

          if (!reasignedNumerations) {
            throw new NumerationBadRequest(
              'Error al reasignar numeraciones del consejo anterior',
            )
          }
        }

        const resevedNumertationsAfterStart =
          await this.dataSource.manager.find(NumerationDocumentEntity, {
            where: {
              council: { id: prevCouncilNumerations.council.id },
              state: NumerationState.RESERVED,
              number:
                LessThan(numerations[0].number) &&
                MoreThan(lastPrevCouncilNumerationUsedOrEnqueued.number) &&
                MoreThanOrEqual(start),
            },
            order: { number: 'DESC' },
          })

        if (resevedNumertationsAfterStart.length > 0) {
          const reasignedNumerations = await this.reasignNumerations(
            resevedNumertationsAfterStart,
            councilId,
          )

          return reasignedNumerations
        }
      }

      if (end <= numerations[0].number) {
        const postCouncilNumerations = await this.dataSource.manager.findOne(
          NumerationDocumentEntity,
          {
            where: {
              council: { id: Not(councilId) },
              state: NumerationState.RESERVED,
              number: numerations[0].number + 1,
            },
          },
        )

        if (!postCouncilNumerations || postCouncilNumerations === null) {
          throw new NumerationBadRequest(
            'El rango de numeración solicitado para ampliarse ya está en uso',
          )
        }

        const firstPostCouncilNumerationUsedOrEnqueued =
          await this.dataSource.manager.findOne(NumerationDocumentEntity, {
            where: {
              council: { id: postCouncilNumerations.council.id },
              state: Not(NumerationState.RESERVED),
              number: MoreThan(numerations[0].number),
            },
            order: { number: 'ASC' },
          })

        if (
          !firstPostCouncilNumerationUsedOrEnqueued ||
          firstPostCouncilNumerationUsedOrEnqueued === null
        ) {
          const reasignedNumerations = await this.reasignNumerations(
            numerations,
            councilId,
          )

          if (!reasignedNumerations) {
            throw new NumerationBadRequest(
              'Error al reasignar numeraciones del consejo posterior',
            )
          }
        }

        const resevedNumertationsBeforeEnd = await this.dataSource.manager.find(
          NumerationDocumentEntity,
          {
            where: {
              council: { id: postCouncilNumerations.council.id },
              state: NumerationState.RESERVED,
              number:
                MoreThan(numerations[0].number) &&
                LessThan(firstPostCouncilNumerationUsedOrEnqueued.number) &&
                LessThan(end),
            },
            order: { number: 'ASC' },
          },
        )

        if (resevedNumertationsBeforeEnd.length > 0) {
          const reasignedNumerations = await this.reasignNumerations(
            resevedNumertationsBeforeEnd,
            councilId,
          )

          return reasignedNumerations
        }
        // generar tambien disminuciones de rango
        // if (end > numerations[0].number + 1) {
        //   await this.reserveNumerationRange(
        //     numerations[0].number + 1,
        //     end,
        //     councilId,
        //     yearModuleId,
        //   )
        // }

        return numerations
      }
    }
  }

  async reasignNumerations(
    numerations: NumerationDocumentEntity[],
    councilId: number,
  ) {
    const reasignedNumerations: NumerationDocumentEntity[] = []

    await this.dataSource.manager.transaction(async (manager) => {
      numerations.forEach(async (numeration) => {
        const numerationDocument = manager.create(NumerationDocumentEntity, {
          number: numeration.number,
          state: NumerationState.RESERVED,
          council: { id: councilId },
          yearModule: { id: numeration.yearModule.id },
        })
        const numerations = await manager.save(numerationDocument)

        if (!numerations) {
          throw new NumerationConflict(
            'Se produjo un conflicto al reservar la numeración',
          )
        }

        reasignedNumerations.push(numerations)
      })
    })

    await Promise.all(reasignedNumerations)

    return reasignedNumerations
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
      throw new NumerationConflict('El número ya está en uso')
    }
  }

  async getAvailableCouncilNumeration(councilId: number) {
    const availableCounsilNumeration = await this.dataSource.manager
      .getRepository(NumerationDocumentEntity)
      .find({
        where: { council: { id: councilId }, state: Not(NumerationState.USED) },
        order: { number: 'ASC' },
      })

    if (
      !availableCounsilNumeration ||
      availableCounsilNumeration.length === 0
    ) {
      throw new NumerationBadRequest(
        'No hay números disponibles para el consejo y los siguientes se encuentran en uso',
      )
    }

    return new ApiResponseDto(
      'Numeración disponible encontrada exitosamente',
      availableCounsilNumeration,
    )
  }

  async create(createNumerationDocumentDto: CreateNumerationDocumentDto) {
    if (createNumerationDocumentDto.number <= 0) {
      throw new NumerationBadRequest(
        'El número debe ser mayor a 0, posiblemente no existe numeración disponible para el consejo',
      )
    }

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

        const numeration = await this.createLastNumeration(
          createNumerationDocumentDto.number,
          createNumerationDocumentDto.councilId,
          yearModule.id,
        )

        return numeration
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
          throw new NumerationBadRequest(
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

          const numeration = await this.createLastNumeration(
            createNumerationDocumentDto.number,
            createNumerationDocumentDto.councilId,
            yearModule.id,
          )

          return numeration
        } else {
          const { data: availableCouncilNumeration } =
            await this.getAvailableCouncilNumeration(
              createNumerationDocumentDto.councilId,
            )

          if (
            createNumerationDocumentDto.number <=
            availableCouncilNumeration[0].number
          ) {
            throw new NumerationBadRequest(
              'El número ya es parte de la numeración de otro consejo',
            )
          }

          const numerationDocument = availableCouncilNumeration.find(
            (numeration) =>
              numeration.number === createNumerationDocumentDto.number,
          )

          if (!numerationDocument) {
            throw new NumerationBadRequest(
              'El número ya es parte de la numeración de otro consejo',
            )
          }
          // TODO: Make remove or move reserved numerations between councils when the council with the major range of numeration has only reserved numerations up to the requested number

          numerationDocument.state = NumerationState.USED

          const entity = await this.dataSource.manager.save(
            NumerationDocumentEntity,
            numerationDocument,
          )

          return new ApiResponseDto('Numeración creada exitosamente', entity)
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

  async documentRemoved(document: DocumentEntity) {
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
        throw new NumerationBadRequest('Error al eliminar el documento')
      }

      return new ApiResponseDto('Documento eliminado exitosamente', {
        success: true,
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
        throw new NumerationBadRequest('Council not found')
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

      return new ApiResponseDto(
        'Numeración por consejo encontrada exitosamente',
        NumerationByCouncil,
      )
    } catch (error) {
      if (error.status) throw new NumerationBadRequest(error.message)

      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const numerationDocument =
        await this.numerationDocumentRepository.findOneOrFail({
          where: { id },
          relations: ['council'],
        })

      return new ApiResponseDto(
        'Numeración encontrada exitosamente',
        numerationDocument,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      const numerationDeleted = await this.numerationDocumentRepository.delete(
        id,
      )

      if (!numerationDeleted) {
        throw new NumerationBadRequest('Error al eliminar la numeración')
      }

      return new ApiResponseDto('Numeración eliminada exitosamente', {
        success: true,
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
