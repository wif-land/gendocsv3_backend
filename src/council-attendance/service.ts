import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CouncilAttendanceEntity } from '../councils/entities/council-attendance.entity'
import { CreateEditDefaultMemberDTO } from './dto/create-edit-default-member.dto'
import { GetDefaultMembers } from './dto/default-members-get.dto'

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(CouncilAttendanceEntity)
    private readonly councilAttendanceRepository: Repository<CouncilAttendanceEntity>,
  ) {}

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
      select: ['student', 'functionary', 'positionOrder', 'positionName', 'id'],
      order: {
        positionOrder: 'ASC',
      },
    })

    return defaultAttendance.map(
      (item) =>
        new GetDefaultMembers(item.id, item.positionOrder, item.positionName, {
          student: item.student,
          functionary: item.functionary,
        }),
    )
  }

  async create(body: any) {
    return await this.councilAttendanceRepository.save(body)
  }

  async createEditDefault(
    moduleId: number,
    body: CreateEditDefaultMemberDTO[],
  ) {
    const toCreate = body.filter((item) => item.action === 'create')
    const toUpdate = body.filter((item) => item.action === 'update')
    const toDelete = body.filter((item) => item.action === 'delete')

    const createPromises = toCreate.map(async (item) => {
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

    const updatePromises = toUpdate.map(async (item) => {
      const prevItem = await this.councilAttendanceRepository.findOne({
        where: {
          id: item.id,
        },
        relations: ['functionary', 'student'],
      })

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

    const deletePromises = toDelete.map(async (item) => {
      await this.councilAttendanceRepository.delete(item.id)
    })

    const promises = [...createPromises, ...updatePromises, ...deletePromises]

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
}
