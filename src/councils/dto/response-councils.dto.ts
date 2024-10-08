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
  members: any
  isActive: boolean
  isArchived: boolean
  recopilationDriveId: string
  hasProcessedDocuments: boolean
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
    this.members = council.attendance.map((member) => ({
      ...member,
      member: member.student ?? member.functionary,
    }))
    this.recopilationDriveId = council.recopilationDriveId
    this.hasProcessedDocuments = council.hasProcessedDocuments
    this.type = council.type
  }
}
