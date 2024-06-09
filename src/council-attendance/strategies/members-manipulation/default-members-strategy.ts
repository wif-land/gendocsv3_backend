import { CreateEditDefaultMemberDTO } from '../../dto/create-edit-default-member.dto'
import { CouncilAttendanceEntity } from '../../../councils/entities/council-attendance.entity'
import { Repository } from 'typeorm'

export abstract class DefaultMemberStrategy {
  protected repository: Repository<CouncilAttendanceEntity>
  protected moduleId: number
  protected params: CreateEditDefaultMemberDTO[]

  abstract execute(defaultMembers?: CouncilAttendanceEntity[]): Promise<void>[]

  setRepository(repository: Repository<CouncilAttendanceEntity>): void {
    this.repository = repository
  }

  setModuleId(moduleId: number): void {
    this.moduleId = moduleId
  }

  setParams(params: CreateEditDefaultMemberDTO[]): void {
    this.params = params
  }

  async validateDifferentsMembers(
    members: CreateEditDefaultMemberDTO[],
    membersExist: CouncilAttendanceEntity[],
  ) {
    const studentMembers = members.filter((member) => member.isStudent)
    const functionaryMembers = members.filter((member) => !member.isStudent)

    const studentsMembersSet = new Set(
      studentMembers.map((member) => member.member),
    )
    const functionaryMembersSet = new Set(
      functionaryMembers.map((member) => member.member),
    )

    membersExist.forEach((member) => {
      if (member.student) {
        studentsMembersSet.add(member.student.id)
      } else {
        functionaryMembersSet.add(member.functionary.id)
      }
    })
  }
}
