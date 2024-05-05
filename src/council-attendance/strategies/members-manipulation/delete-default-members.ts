import { DefaultMemberStrategy } from './default-members-strategy'

export class DeleteDefaultMemberStrategy extends DefaultMemberStrategy {
  execute() {
    return this.params.map(async (item) => {
      await this.repository.delete(item.id)
    })
  }
}
