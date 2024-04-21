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

  async createDefault(moduleId: number, body: DefaultCreationDTO[]) {
    const promises = body.map(async (item) => {
      const memberProps = {}
      if (!item.isStudent) {
        memberProps['functionary'] = {
          id: item.member,
        }
      } else {
        memberProps['student'] = {
          id: item.member,
        }
      }

      delete item.member
      delete item.isStudent

      await this.create({
        ...item,
        ...memberProps,
        module: {
          id: moduleId,
        },
      })
    })

    return await Promise.all(promises)
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
      const prevItem = await this.councilAttendanceRepository.findOne({
        where: {
          id: item.id,
        },
        relations: ['functionary', 'student'],
      })

      console.log({ prevItem })

      const extraParams = {
        ...item,
      }

      if (item.member) {
        if (item.isStudent && prevItem.functionary.id) {
          extraParams['functionary'] = {
            id: null,
          }
          extraParams['student'] = {
            id: item.member,
          }
        }

        if (!item.isStudent && prevItem.student.id) {
          extraParams['functionary'] = {
            id: item.member,
          }
          extraParams['student'] = {
            id: null,
          }
        }
      }

      delete extraParams.isStudent
      delete extraParams.member

      await this.councilAttendanceRepository.update(item.id, extraParams)
    })

    await Promise.all(promises)

    return body
  }
}
