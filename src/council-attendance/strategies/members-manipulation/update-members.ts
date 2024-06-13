import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception'
import { CouncilAttendanceEntity } from '../../../councils/entities/council-attendance.entity'
import { DefaultMemberStrategy } from './default-members-strategy'

export class UpdateDefaultMemberStrategy extends DefaultMemberStrategy {
  execute(defaultMembers: CouncilAttendanceEntity[]) {
    if (!defaultMembers.length) {
      throw new Error('No existen representantes por defecto para este módulo')
    }

    return this.params.map(async (item) => {
      if (!item.id) {
        throw new BadRequestException(
          'No se ha proporcionado el ID del representante',
        )
      }

      const prevItem = await this.repository.findOne({
        where: {
          id: item.id,
        },
        relations: ['functionary', 'student'],
      })

      const extraParams = {
        ...item,
      }

      if (item.member) {
        if (item.isStudent && prevItem.functionary?.id) {
          const alreadyExists = defaultMembers.find(
            (member) => member.student?.id === item.member,
          )

          if (alreadyExists) {
            throw new BadRequestException(
              'El estudiante ya se encuentra en la lista',
            )
          }

          extraParams['functionary'] = {
            id: null,
          }
          extraParams['student'] = {
            id: item.member,
          }
        }

        if (!item.isStudent && prevItem.student?.id) {
          const alreadyExists = defaultMembers.find(
            (member) => member.functionary?.id === item.member,
          )

          if (alreadyExists) {
            throw new BadRequestException(
              'El funcionario ya se encuentra en la lista',
            )
          }

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
      delete extraParams.action

      await this.repository.update(item.id, extraParams)
    })
  }
}
