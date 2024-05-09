import { InjectRepository } from '@nestjs/typeorm'
import { DefaultMemberStrategy } from './default-members-strategy'
import { CouncilAttendanceEntity } from '../../../councils/entities/council-attendance.entity'
import { Repository } from 'typeorm'
import { CreateEditDefaultMemberDTO } from '../../dto/create-edit-default-member.dto'

export class DefaultMembersContext {
  private strategy: DefaultMemberStrategy

  constructor(
    @InjectRepository(CouncilAttendanceEntity)
    private readonly repository: Repository<CouncilAttendanceEntity>,
    private readonly moduleId: number,
  ) {}

  execute() {
    return this.strategy.execute()
  }

  setStrategy(strategy: DefaultMemberStrategy) {
    this.strategy = strategy
    this.strategy.setRepository(this.repository)
    this.strategy.setModuleId(this.moduleId)
    return this
  }

  setParams(params: CreateEditDefaultMemberDTO[]) {
    if (!this.strategy) {
      throw new Error('Strategy is not set')
    }

    this.strategy.setParams(params)
    return this
  }
}
