import { CreateEditDefaultMemberDTO } from '../../dto/create-edit-default-member.dto'
import { CouncilAttendanceEntity } from '../../../councils/entities/council-attendance.entity'
import { Repository } from 'typeorm'

export abstract class DefaultMemberStrategy {
  protected repository: Repository<CouncilAttendanceEntity>
  protected moduleId: number
  protected params: CreateEditDefaultMemberDTO[]

  abstract execute(): Promise<void>[]

  setRepository(repository: Repository<CouncilAttendanceEntity>): void {
    this.repository = repository
  }

  setModuleId(moduleId: number): void {
    this.moduleId = moduleId
  }

  setParams(params: CreateEditDefaultMemberDTO[]): void {
    this.params = params
  }
}
