import { Inject, Injectable } from '@nestjs/common'
import { CreateCouncilDto } from './dto/create-council.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CouncilEntity } from './entities/council.entity'
import { Repository } from 'typeorm'
import { CouncilAttendanceEntity } from './entities/council-attendance.entity'
import { FilesService } from '../files/files.service'
import { ModuleEntity } from '../modules/entities/modules.entity'

@Injectable()
export class CouncilsService {
  constructor(
    @InjectRepository(CouncilEntity)
    private readonly councilRepository: Repository<CouncilEntity>,
    @InjectRepository(CouncilAttendanceEntity)
    private readonly councilAttendanceRepository: Repository<CouncilAttendanceEntity>,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) {}

  async create(createCouncilDto: CreateCouncilDto) {
    const { attendance = [], ...councilData } = createCouncilDto
    const hasAttendance = attendance.length > 0

    try {
      const { driveId: moduleFolderId } = await this.moduleRepository.findOne({
        where: { id: createCouncilDto.moduleId },
        select: ['driveId'],
      })

      const driveId = await this.filesService.createFolder(councilData.name, [
        moduleFolderId,
      ])

      const council = this.councilRepository.create({
        ...councilData,
        driveId,
        module: { id: createCouncilDto.moduleId },
        user: { id: createCouncilDto.userId },
        submoduleYearModule: { id: createCouncilDto.submoduleYearModuleId },
      })
      const councilInserted = await this.councilRepository.save(council)

      if (!hasAttendance) {
        return await this.councilRepository.save(council)
      }

      const councilAttendance = attendance.map((item) =>
        this.councilAttendanceRepository.create({
          ...item,
          council: { id: councilInserted.id },
          functionary: { id: item.functionaryId },
        }),
      )

      const attendanceResult = await this.councilAttendanceRepository.save(
        councilAttendance,
      )

      return {
        ...councilInserted,
        attendance: attendanceResult,
      }
    } catch (error) {
      console.log({ error })
      throw error
    }
  }

  findAll() {
    return `This action returns all councils`
  }

  findOne(id: number) {
    return `This action returns a #${id} council`
  }

  update(id: number, updateCouncilDto: Partial<CreateCouncilDto>) {
    return `This action updates a #${id} council${updateCouncilDto}`
  }

  remove(id: number) {
    return `This action removes a #${id} council`
  }
}
