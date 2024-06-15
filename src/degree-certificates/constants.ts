import { DATE_TYPES } from '../councils/dto/council-filters.dto'
import { NotificationEntity } from '../notifications/entities/notification.entity'
import { CreateDegreeCertificateBulkDto } from './dto/create-degree-certificate-bulk.dto'

export enum DEGREE_CERTIFICATE {
  REPOSITORY = 'DegreeCertificateRepository',
}

export enum DEGREE_MODALITY {
  ONLINE = 'ONL',
  PRESENCIAL = 'PRE',
}

export const CERTIFICATE_QUEUE_NAME = 'CERTIFICATE_QUEUE'

export interface CertificateBulkCreation {
  notification: NotificationEntity
  dto: CreateDegreeCertificateBulkDto
  retries?: NotificationEntity[]
}

export interface IDegreeCertificateFilters {
  careerId?: number
  startDate?: Date
  endDate?: Date
  dateType?: DATE_TYPES
  limit?: number
  offset?: number
  field?: string
}
