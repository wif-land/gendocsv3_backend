import { Process } from '../entities/process.entity'

export class ResponseProcessDto {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  isActive: boolean
  driveId: string
  userId: number
  moduleId: number
  submoduleYearModuleId: number

  constructor(process: Process) {
    this.id = process.id
    this.createdAt = process.createdAt
    this.updatedAt = process.updatedAt
    this.name = process.name
    this.isActive = process.isActive
    this.driveId = process.driveId
    this.userId = process.user.id
    this.moduleId = process.module.id
    this.submoduleYearModuleId = process.submoduleYearModule.id
  }
}
