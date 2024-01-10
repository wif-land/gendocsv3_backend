import { CouncilAttendanceEntity } from '../entities/council-attendance.entity'
import { CouncilEntity } from '../entities/council.entity'
import { CouncilType } from '../interfaces/council.interface'

export class ResponseCouncilsDto {
  id: number
  name: string
  date: Date
  moduleId: number
  userId: number
  driveId: string
  createdAt: Date
  updatedAt: Date
  attendance: number[]
  isActive: boolean
  isArchived: boolean
  type: CouncilType

  constructor(council: CouncilEntity) {
    this.id = council.id
    this.name = council.name
    this.date = council.date
    this.moduleId = council.module.id
    this.userId = council.user.id
    this.driveId = council.driveId
    this.createdAt = council.createdAt
    this.updatedAt = council.updatedAt
    this.isActive = council.isActive
    this.isArchived = council.isArchived
    this.attendance = council.attendance.map(
      (item: CouncilAttendanceEntity) => item.id,
    )
    this.type = council.type
  }
}
