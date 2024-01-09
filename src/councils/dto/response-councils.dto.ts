import { CouncilAttendanceEntity } from '../entities/council-attendance.entity'
import { CouncilEntity } from '../entities/council.entity'

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

  constructor(council: CouncilEntity) {
    this.id = council.id
    this.name = council.name
    this.date = council.date
    this.moduleId = council.module.id
    this.userId = council.user.id
    this.driveId = council.driveId
    this.createdAt = council.createdAt
    this.updatedAt = council.updatedAt
    this.attendance = council.attendance.map(
      (item: CouncilAttendanceEntity) => item.id,
    )
  }
}
