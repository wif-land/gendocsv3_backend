import { CouncilAttendanceEntity } from '../entities/council-attendance.entity'
import { CouncilEntity } from '../entities/council.entity'
import { COUNCIL_TYPES } from '../interfaces/council.interface'

export class ResponseCouncilsDto {
  id: number
  name: string
  date: Date
  moduleId: number
  createdBy: string
  driveId: string
  createdAt: Date
  updatedAt: Date
  members: CouncilAttendanceEntity[]
  isActive: boolean
  isArchived: boolean
  type: COUNCIL_TYPES

  constructor(council: CouncilEntity) {
    this.id = council.id
    this.name = council.name
    this.date = council.date
    this.moduleId = council.module.id
    this.createdBy = `${council.user.firstName} ${council.user.firstLastName}`
    this.driveId = council.driveId
    this.createdAt = council.createdAt
    this.updatedAt = council.updatedAt
    this.isActive = council.isActive
    this.isArchived = council.isArchived
    this.members = council.attendance
    this.type = council.type
  }
}
