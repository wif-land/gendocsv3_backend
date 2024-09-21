import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CareerEntity } from '../careers/entites/careers.entity'
import { GcpService } from '../gcp/gcp.service'
import { ModuleEntity } from '../modules/entities/module.entity'
import { BaseError } from '../shared/utils/error'
import { CreateYearModuleDto } from './dto/create-year-module.dto'
import { SubmoduleYearModuleEntity } from './entities/submodule-year-module.entity'
import { SystemYearEntity } from './entities/system-year.entity'
import { YearModuleEntity } from './entities/year-module.entity'
import { YearModuleAlreadyExists } from './errors/year-module-already-exists'
import { YearModuleError } from './errors/year-module-error'
import { YearModuleNotFound } from './errors/year-module-not-found'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class YearModuleService {
  log: Logger

  constructor(
    @InjectRepository(YearModuleEntity)
    private yearModuleRepository: Repository<YearModuleEntity>,

    @InjectRepository(SubmoduleYearModuleEntity)
    private submoduleYearModuleRepository: Repository<SubmoduleYearModuleEntity>,

    @InjectRepository(ModuleEntity)
    private moduleRepository: Repository<ModuleEntity>,

    @InjectRepository(CareerEntity)
    private careerRepository: Repository<CareerEntity>,

    @InjectRepository(SystemYearEntity)
    private readonly systemYearRepository: Repository<SystemYearEntity>,

    private gcpService: GcpService,
  ) {
    this.log = new Logger(YearModuleService.name)
  }

  private async setCurrentSystemYear(year: number) {
    try {
      const currentYear = await this.systemYearRepository.findOneBy({
        currentYear: year,
      })

      if (currentYear) {
        throw new YearModuleAlreadyExists(
          `El sistema ya está configurado para el año ${year}`,
        )
      } else {
        await this.systemYearRepository.insert({ currentYear: year })
      }
    } catch (e) {
      throw new YearModuleError({
        detail: e.message,
        instance: 'yearModule.errors.setCurrentSystemYear',
      })
    }
  }

  async getCurrentSystemYear() {
    const systemYear = await this.systemYearRepository
      .createQueryBuilder('systemYear')
      .select('systemYear.currentYear')
      .orderBy('systemYear.currentYear', 'DESC')
      .getOne()

    if (!systemYear) {
      throw new YearModuleNotFound('Año del sistema no encontrado')
    }

    return systemYear.currentYear
  }

  async findSubmoduleYearModuleByModule(
    moduleCode: string,
    year: number,
    submoduleName: string,
  ) {
    const submoduleYearModule = await this.submoduleYearModuleRepository
      .createQueryBuilder('submoduleYearModule')
      .leftJoinAndSelect('submoduleYearModule.yearModule', 'yearModule')
      .leftJoinAndSelect('yearModule.module', 'module')
      .where('module.code = :moduleCode', { moduleCode })
      .andWhere('yearModule.year = :year', { year })
      .andWhere('submoduleYearModule.name = :submoduleName', { submoduleName })
      .getOne()

    if (!submoduleYearModule) {
      throw new YearModuleNotFound(
        `Submódulo ${submoduleName} del módulo ${moduleCode} no encontrado`,
      )
    }

    return submoduleYearModule
  }

  async create(createYearModuleDto: CreateYearModuleDto) {
    try {
      const alreadyExists = await this.yearModuleRepository.findOne({
        where: {
          year: createYearModuleDto.year,
          module: { id: createYearModuleDto.module.id },
        },
      })

      if (alreadyExists) {
        throw new YearModuleAlreadyExists(
          `El módulo ${createYearModuleDto.module.name} con año ${createYearModuleDto.year}`,
        )
      }

      const { data: driveId } = await this.gcpService.createFolderByParentId(
        createYearModuleDto.year.toString(),
        createYearModuleDto.module.driveId,
      )

      const yearModule = this.yearModuleRepository.create({
        ...createYearModuleDto,
        driveId,
      })

      const auxYearModule = await this.yearModuleRepository.save(yearModule)

      if (createYearModuleDto.module.code === 'COMM') {
        const { data: actasDirectory } =
          await this.gcpService.createFolderByParentId(
            'Actas de grado',
            auxYearModule.driveId,
          )

        const actasSubmodule = this.submoduleYearModuleRepository.create({
          name: 'Actas de grado',
          driveId: actasDirectory,
          yearModule: auxYearModule,
        })

        await this.submoduleYearModuleRepository.save(actasSubmodule)
      } else {
        if (!createYearModuleDto.isYearUpdate) {
          const { data: processesDirectory } =
            await this.gcpService.createFolderByParentId(
              'Procesos',
              auxYearModule.driveId,
            )

          const processesSubmodule = this.submoduleYearModuleRepository.create({
            name: 'Procesos',
            driveId: processesDirectory,
            yearModule: auxYearModule,
          })

          await this.submoduleYearModuleRepository.save(processesSubmodule)
        }

        const { data: councilsDirectory } =
          await this.gcpService.createFolderByParentId(
            'Consejos',
            auxYearModule.driveId,
          )

        const councilsSubmodule = this.submoduleYearModuleRepository.create({
          name: 'Consejos',
          driveId: councilsDirectory,
          yearModule: auxYearModule,
        })

        await this.submoduleYearModuleRepository.save(councilsSubmodule)
      }
    } catch (e) {
      if (e instanceof BaseError) throw e

      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async prepareToUpdateSystemYear(year: number) {
    /* Obtiene el año actual del sistem
     * el año actual del sistema debe ser menos uno que el año que se desea actualizar
     * obtener los modulos activos y las carreras activas
     * comparar modulos activos con las carreras activas
     * crear moduleYearModule -> subModuleYearModule -> actualizar systemYear
     */
    const currentSystemYear = await this.getCurrentSystemYear()

    if (currentSystemYear !== year - 1) {
      throw new HttpException(
        'El año a actualizar debe ser el año siguiente al actual',
        HttpStatus.BAD_REQUEST,
      )
    }

    const activeModules = await this.moduleRepository.find({
      where: {
        isActive: true,
      },
    })

    const activeCareers = await this.careerRepository.find({
      where: {
        isActive: true,
      },
    })

    for (const module of activeModules) {
      for (const career of activeCareers) {
        if (module.name === career.moduleName) {
          await this.create({
            year,
            module,
            isYearUpdate: true,
          })
          break
        }
      }
    }

    await this.setCurrentSystemYear(year)

    return new ApiResponseDto(`Año del sistema actualizado a ${year}`, {
      success: true,
    })
  }
}
