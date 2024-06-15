import { DefaultMemberStrategy } from './default-members-strategy'

export class DeleteDefaultMemberStrategy extends DefaultMemberStrategy {
  execute() {
    if (this.params.length === 0) {
      return []
    }

    return this.params.map(async (item) => {
      await this.repository.delete(item.id)
    })
  }
}
