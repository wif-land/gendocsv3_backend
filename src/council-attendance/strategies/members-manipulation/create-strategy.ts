import { DefaultMemberStrategy } from './default-members-strategy'

export class CreateDefaultMemberStrategy extends DefaultMemberStrategy {
  execute() {
    return this.params.map(async (item) => {
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
