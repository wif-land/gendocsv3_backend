import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { FilesService } from '../files/files.service'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModuleEntity } from '../year-module/entities/submodule-year-module.entity'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'
import { CouncilEntity } from '../councils/entities/council.entity'
import { CouncilAttendanceEntity } from '../councils/entities/council-attendance.entity'
import { DefaultCreationDTO } from './dto/default-creation.dto'

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(CouncilEntity)
    private readonly councilRepository: Repository<CouncilEntity>,
    @InjectRepository(FunctionaryEntity)
    private readonly functionaryRepository: Repository<FunctionaryEntity>,
    @InjectRepository(CouncilAttendanceEntity)
    private readonly councilAttendanceRepository: Repository<CouncilAttendanceEntity>,
    @InjectRepository(YearModuleEntity)
    private readonly yearModuleRepository: Repository<YearModuleEntity>,
    @InjectRepository(SubmoduleYearModuleEntity)
    private readonly submoduleYearModuleRepository: Repository<SubmoduleYearModuleEntity>,
    @Inject(FilesService)
    private readonly filesService: FilesService,
    private readonly dataSource: DataSource,
  ) { }

  async getDefaultByModule(moduleId: number) {
    const defaultAttendance = await this.councilAttendanceRepository.find({
      where: {
        council: {
          id: null,
        },
        module: {
          id: moduleId,
        },
      },
      relations: ['functionary', 'student'],
      select: [
        'student',
        'functionary',
        'positionOrder',
        'positionName',
        'id',
        'createdAt',
        'updatedAt',
        'isPresident',
      ],
      order: {
        positionOrder: 'ASC',
      },
    })

    return defaultAttendance
  }

  async create(body: any) {
    return await this.councilAttendanceRepository.save(body)
  }

  async createDefault(body: DefaultCreationDTO) {
    return await this.create(body)
  }

  async getByCouncil(councilId: number) {
    return await this.councilAttendanceRepository.find({
      where: {
        council: {
          id: councilId,
        },
      },
      relations: ['functionary', 'student'],
      select: [
        'student',
        'functionary',
        'positionOrder',
        'positionName',
        'id',
        'createdAt',
        'updatedAt',
        'isPresident',
      ],
      order: {
        positionOrder: 'ASC',
      },
    })
  }
}
