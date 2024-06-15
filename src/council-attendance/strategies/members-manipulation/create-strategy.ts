import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception'
import { CouncilAttendanceEntity } from '../../../councils/entities/council-attendance.entity'
import { DefaultMemberStrategy } from './default-members-strategy'

export class CreateDefaultMemberStrategy extends DefaultMemberStrategy {
  execute(members?: CouncilAttendanceEntity[]) {
    if (this.params.length === 0) return []

    return this.params.map(async (item) => {
      const memberProps = {}
      if (!item.isStudent) {
        if (members && members.length > 0) {
          const alreadyExist = members.find(
            (member) => member.functionary?.id === item.member,
          )

          if (alreadyExist) {
            throw new BadRequestException(
              'El funcionario ya se encuentra en la lista',
            )
          }
        }
        memberProps['functionary'] = {
          id: item.member,
        }
      } else {
        if (members && members.length > 0) {
          const alreadyExist = members.find(
            (member) => member.student?.id === item.member,
          )

          if (alreadyExist) {
            throw new BadRequestException(
              'El estudiante ya se encuentra en la lista',
            )
          }
        }

        memberProps['student'] = {
          id: item.member,
        }
      }

      delete item.member
      delete item.isStudent
      delete item.action

      await this.repository.save({
        ...item,
        ...memberProps,
        module: {
          id: this.moduleId,
        },
      })
    })
  }
}
