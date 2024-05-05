import { DefaultMemberStrategy } from './default-members-strategy'

export class UpdateDefaultMemberStrategy extends DefaultMemberStrategy {
  execute() {
    return this.params.map(async (item) => {
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
          extraParams['functionary'] = {
            id: null,
          }
          extraParams['student'] = {
            id: item.member,
          }
        }

        if (!item.isStudent && prevItem.student?.id) {
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
