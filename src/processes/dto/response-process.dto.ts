import { ResponseTemplateDto } from '../../templates/dto/response-template.dto'
import { ProcessEntity } from '../entities/process.entity'

export class ResponseProcessDto {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  isActive: boolean
  driveId: string
  userId: number
  moduleId: number
  templateProcesses: ResponseTemplateDto[]

  constructor(process: ProcessEntity) {
    this.id = process.id
    this.createdAt = process.createdAt
    this.updatedAt = process.updatedAt
    this.name = process.name
    this.isActive = process.isActive
    this.driveId = process.driveId
    this.userId = process.user.id
    this.moduleId = process.module.id
    this.templateProcesses = process.templateProcesses != null && process.templateProcesses.length > 0 ? process.templateProcesses.map(
      (templateProcess) => new ResponseTemplateDto(templateProcess)) : []
  }
}
