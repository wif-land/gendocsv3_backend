import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CouncilAttendanceEntity } from '../councils/entities/council-attendance.entity'
import { DefaultCreationDTO } from './dto/default-creation.dto'
import { DefaultEditionDTO } from './dto/default-edition.dto'

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(CouncilAttendanceEntity)
    private readonly councilAttendanceRepository: Repository<CouncilAttendanceEntity>,
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

  async updateDefault(body: DefaultEditionDTO[]) {
    const promises = body.map(async (item) => {
      await this.councilAttendanceRepository.update(item.id, item as any)
    })

    await Promise.all(promises)

    return body
  }
}
