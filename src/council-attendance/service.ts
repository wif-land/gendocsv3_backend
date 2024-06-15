import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, IsNull, Repository } from 'typeorm'
import { CouncilAttendanceEntity } from '../councils/entities/council-attendance.entity'
import { CreateEditDefaultMemberDTO } from './dto/create-edit-default-member.dto'
import { GetDefaultMembers } from './dto/default-members-get.dto'
import { CreateDefaultMemberStrategy } from './strategies/members-manipulation/create-strategy'
import { UpdateDefaultMemberStrategy } from './strategies/members-manipulation/update-members'
import { DeleteDefaultMemberStrategy } from './strategies/members-manipulation/delete-default-members'
import { DefaultMembersContext } from './strategies/members-manipulation/default-members-context'
import { EmailService } from '../email/email.service'

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(CouncilAttendanceEntity)
    private readonly councilAttendanceRepository: Repository<CouncilAttendanceEntity>,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    private readonly dataSource: DataSource,
  ) {}

  async getDefaultByModule(moduleId: number, returnEntity = false) {
    const defaultAttendance = await this.councilAttendanceRepository.find({
      where: {
        council: {
          id: IsNull(),
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

    if (returnEntity) {
      return defaultAttendance
    }

    return defaultAttendance.map(
      (item) =>
        new GetDefaultMembers(item.id, item.positionOrder, item.positionName, {
          student: item.student,
          functionary: item.functionary,
        }),
    )
  }

  async handleDefaultMembersManipulation(
    moduleId: number,
    body: CreateEditDefaultMemberDTO[],
  ) {
    const defaultMembers: CouncilAttendanceEntity[] =
      (await this.getDefaultByModule(
        moduleId,
        true,
      )) as CouncilAttendanceEntity[]

    const councilAttendanceCommands = new DefaultMembersContext(
      this.councilAttendanceRepository,
      moduleId,
    )
    const toDelete = body.filter((item) => item.action === 'delete')
    councilAttendanceCommands
      .setStrategy(new DeleteDefaultMemberStrategy())
      .setParams(toDelete)
    const deletePromises = councilAttendanceCommands.execute()

    const toUpdate = body.filter((item) => item.action === 'update')
    councilAttendanceCommands
      .setStrategy(new UpdateDefaultMemberStrategy())
      .setParams(toUpdate)
    const updatePromises = councilAttendanceCommands.execute(defaultMembers)

    const toCreate = body.filter((item) => item.action === 'create')
    councilAttendanceCommands
      .setStrategy(new CreateDefaultMemberStrategy())
      .setParams(toCreate)
    const createPromises = councilAttendanceCommands.execute(defaultMembers)

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

  async toggleHasAssisted(id: number) {
    const member = await this.councilAttendanceRepository.findOne({
      where: {
        id,
      },
    })
    member.hasAttended = !member.hasAttended
    return await this.councilAttendanceRepository.save(member)
  }
}
