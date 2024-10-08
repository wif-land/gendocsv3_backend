import { formatNumeration } from '../../shared/utils/string'
import { DocumentEntity } from '../entities/document.entity'

export class ResponseDocumentDto {
  constructor(document: DocumentEntity) {
    this.id = document.id
    this.number = formatNumeration(document.numerationDocument.number)
    this.councilId = document.numerationDocument.council.id
    this.createdAt = document.createdAt
    this.driveId = document.driveId
    this.userId = document.user.id
    this.templateId = document.templateProcess.id
    this.studentId = document.student ? document.student.id : null
    this.functionaries = document.documentFunctionaries
      ? document.documentFunctionaries.map((docFunctionary) => ({
          id: docFunctionary.functionary.id,
          functionaryNotified: docFunctionary.functionaryNotified,
        }))
      : null
    this.description = document.description
    this.variables = document.variables
    this.studentNotified = document.studentNotified
  }

  id: number
  number: string
  councilId: number
  createdAt: Date
  driveId: string
  userId: number
  templateId: number
  studentId: number
  functionaries: {
    id: number
    functionaryNotified: boolean
  }[]
  description: string
  variables: string
  studentNotified: boolean
}
