import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateNumerationDocumentDto } from './dto/create-numeration-document.dto'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Between,
  DataSource,
  LessThan,
  MoreThan,
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
import { ReserveNumerationDocumentDto } from './dto/reserve-numeration.dto'

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

  async getNextNumberToRegister(moduleId: number) {
    const yearModule = await this.dataSource.manager.findOne(YearModuleEntity, {
      where: { module: { id: moduleId } },
    })

    if (!yearModule) {
      throw new NumerationBadRequest('YearModule not found')
    }

    const numeration = await this.dataSource.manager.find(
      NumerationDocumentEntity,
      {
        where: { yearModule: { id: yearModule.id } },
        order: { number: 'DESC' },
      },
    )

    if (!numeration || numeration.length === 0) {
      return 1
    }

    return numeration[0].number + 1
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

  async getLastRegisterNumeration(moduleId: number) {
    const yearModule = await this.dataSource.manager.findOne(YearModuleEntity, {
      where: { module: { id: moduleId } },
    })

    if (!yearModule) {
      throw new NumerationBadRequest('YearModule not found')
    }

    const numeration = await this.dataSource.manager.findOne(
      NumerationDocumentEntity,
      {
        where: { yearModule: { id: yearModule.id } },
        order: { number: 'DESC' },
      },
    )

    return numeration
  }

  async getCouncilsCouldReserveNumeration(moduleId: number) {
    const yearModule = await this.dataSource.manager.findOne(YearModuleEntity, {
      where: { module: { id: moduleId } },
    })

    if (!yearModule) {
      throw new NumerationBadRequest('YearModule not found')
    }

    const councilsCouldReserveNumeration: CouncilEntity[] = []

    const councils = await this.dataSource.manager.find(CouncilEntity, {
      where: { module: { id: moduleId } },
    })

    if (!councils || councils.length === 0) {
      throw new NumerationBadRequest('Councils not found')
    }

    await Promise.all(
      councils.map(async (council) => {
        const numerations = await this.dataSource.manager.find(
          NumerationDocumentEntity,
          {
            where: {
              council: { id: council.id },
              yearModule: { id: yearModule.id },
            },
            order: { number: 'DESC' },
          },
        )

        if (!numerations || numerations.length === 0) {
          councilsCouldReserveNumeration.push(council)
        } else {
          if (numerations[0].number < 1) {
            councilsCouldReserveNumeration.push(council)
          } else {
            const lastNumerationCreated = numerations[0]

            if (lastNumerationCreated.council.id === council.id) {
              councilsCouldReserveNumeration.push(council)
            }
          }
        }
      }),
    )

    return new ApiResponseDto(
      'Consejos que podrían reservar numeración encontrados exitosamente',
      councilsCouldReserveNumeration,
    )
  }

  async findAvailableExtensionNumeration(
    council: CouncilEntity,
    numerations: NumerationDocumentEntity[],
  ) {
    let start: number
    let end: number

    if (numerations[-1].number === 1) {
      start = 1
    } else {
      const beforeRangeCouncilNumeration =
        await this.dataSource.manager.findOne(NumerationDocumentEntity, {
          where: {
            council: { id: Not(council.id) },
            state: NumerationState.RESERVED,
            number: numerations[-1].number - 1,
          },
        })

      if (
        !beforeRangeCouncilNumeration ||
        beforeRangeCouncilNumeration === null
      ) {
        start = numerations[-1].number
      }

      const beforeRangeCouncilNumerations = await this.dataSource.manager.find(
        NumerationDocumentEntity,
        {
          where: {
            council: { id: beforeRangeCouncilNumeration.council.id },
            number: LessThan(numerations[-1].number),
          },
          order: { number: 'DESC' },
        },
      )

      let lastAvailableNumeration = numerations[-1].number

      for (
        let index = 0;
        index < beforeRangeCouncilNumerations.length;
        index++
      ) {
        if (
          beforeRangeCouncilNumerations[index].state !==
          NumerationState.RESERVED
        ) {
          lastAvailableNumeration = lastAvailableNumeration
          break
        }

        lastAvailableNumeration = beforeRangeCouncilNumerations[index].number
      }

      start = lastAvailableNumeration
    }

    const lastNumeration = await this.getLastRegisterNumeration(
      council.module.id,
    )
    if (lastNumeration.council.id === council.id) {
      end = 0

      return { start, end }
    }

    const afterRangeCouncilNumeration = await this.dataSource.manager.findOne(
      NumerationDocumentEntity,
      {
        where: {
          council: { id: Not(council.id) },
          state: NumerationState.RESERVED,
          number: numerations[0].number + 1,
        },
      },
    )

    if (!afterRangeCouncilNumeration || afterRangeCouncilNumeration === null) {
      end = numerations[0].number

      return { start, end }
    }

    let lastAvailableNumeration = numerations[0].number

    const councilAfterNumerations = await this.dataSource.manager.find(
      NumerationDocumentEntity,
      {
        where: {
          council: { id: afterRangeCouncilNumeration.council.id },
          number: MoreThan(numerations[0].number),
        },
        order: { number: 'ASC' },
      },
    )

    for (let index = 0; index < councilAfterNumerations.length; index++) {
      if (councilAfterNumerations[index].state !== NumerationState.RESERVED) {
        lastAvailableNumeration = lastAvailableNumeration
        break
      }

      lastAvailableNumeration = councilAfterNumerations[index].number
    }

    end = lastAvailableNumeration

    return { start, end }
  }

  async getAvailableExtensionNumeration(councilId: number) {
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
        'No hay numeración reservada para el consejo, en lugar de ampliar el rango de numeración, cree una reservación de numeración',
      )
    }

    const numeration = await this.findAvailableExtensionNumeration(
      council,
      numerations,
    )

    if (!numeration) {
      throw new NumerationBadRequest(
        'No hay numeración disponible para ampliar',
      )
    }

    if (
      numeration.start === numerations[-1].number &&
      numeration.end === numerations[0].number
    ) {
      throw new NumerationBadRequest(
        'No hay numeración disponible para ampliar',
      )
    }

    return new ApiResponseDto(
      'Numeración de extensión disponible obtenida exitosamente',
      numeration,
    )
  }

  async reserveNumerationRange(
    start: number,
    end: number,
    councilId: number,
    yearModuleId: number,
  ) {
    const reservedNumberations: NumerationDocumentEntity[] = []

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
      const numeration = await this.dataSource.manager.save(numerationDocument)

      if (!numeration) {
        throw new NumerationConflict(
          'Se produjo un conflicto al reservar la numeración',
        )
      }

      reservedNumberations.push(numeration)
    }

    await Promise.all(reservedNumberations)

    return reservedNumberations
  }

  async reserveNumeration({
    start,
    end,
    councilId,
    isExtension,
  }: ReserveNumerationDocumentDto) {
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
    if (isExtension) {
      const reservedNumerations: NumerationDocumentEntity[] = []

      if (!numerations || numerations.length === 0) {
        throw new NumerationBadRequest(
          'No hay numeración reservada para el consejo, cree una reservación de numeración en lugar de ampliarla',
        )
      }

      if (start <= numerations[-1].number) {
        const prevCouncilNumerations = await this.dataSource.manager.findOne(
          NumerationDocumentEntity,
          {
            where: {
              council: { id: Not(councilId) },
              state: NumerationState.RESERVED,
              number: numerations[-1].number - 1,
            },
          },
        )

        if (!prevCouncilNumerations || prevCouncilNumerations === null) {
          throw new NumerationBadRequest(
            'El rango de numeración solicitado para ampliarse ya está en uso',
          )
        }

        const numbersToReserveBetweenCouncils =
          await this.dataSource.manager.find(NumerationDocumentEntity, {
            where: {
              council: { id: prevCouncilNumerations.council.id },
              state: NumerationState.RESERVED,
              number: Between(start, numerations[-1].number - 1),
            },
            order: { number: 'DESC' },
          })

        if (
          numbersToReserveBetweenCouncils.length !==
          numerations[-1].number - start
        ) {
          throw new NumerationBadRequest(
            'El rango de numeración solicitado para ampliarse ya está en uso',
          )
        }

        const reasignedNumerations = await this.reasignNumerations(
          numbersToReserveBetweenCouncils,
          councilId,
        )

        if (!reasignedNumerations) {
          throw new NumerationBadRequest(
            'Error al reasignar numeraciones del consejo anterior',
          )
        }

        reservedNumerations.concat(reasignedNumerations)
      }

      if (end >= numerations[0].number) {
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

        const numbersToReserveBetweenCouncils =
          await this.dataSource.manager.find(NumerationDocumentEntity, {
            where: {
              council: { id: postCouncilNumerations.council.id },
              state: NumerationState.RESERVED,
              number: Between(numerations[0].number + 1, end),
            },
            order: { number: 'ASC' },
          })

        if (
          numbersToReserveBetweenCouncils.length !==
          end - numerations[0].number
        ) {
          throw new NumerationBadRequest(
            'El rango de numeración solicitado para ampliarse ya está en uso',
          )
        }

        const reasignedNumerations = await this.reasignNumerations(
          numbersToReserveBetweenCouncils,
          councilId,
        )

        if (!reasignedNumerations) {
          throw new NumerationBadRequest(
            'Error al reasignar numeraciones del consejo posterior',
          )
        }

        reservedNumerations.concat(reasignedNumerations)
      }

      return reservedNumerations
    }

    const lastModuleUsedOrQueuedNumeration =
      await this.dataSource.manager.findOne(NumerationDocumentEntity, {
        where: {
          yearModule: { id: yearModule.data.id },
          state: NumerationState.USED || NumerationState.ENQUEUED,
        },
        order: { number: 'DESC' },
      })

    if (lastModuleUsedOrQueuedNumeration.number > start) {
      throw new NumerationBadRequest(
        'No se puede reservar el rango de numeración solicitado, ya que el número de inicio es menor al último número usado o en cola',
      )
    }

    const reservedNumerations = await this.reserveNumerationRange(
      start,
      end,
      councilId,
      yearModule.data.id,
    )

    return reservedNumerations
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
