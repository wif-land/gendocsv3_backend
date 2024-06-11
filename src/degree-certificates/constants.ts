import { NotificationEntity } from '../notifications/entities/notification.entity'
import { CreateDegreeCertificateBulkDto } from './dto/create-degree-certificate-bulk.dto'

export enum DEGREE_CERTIFICATE {
  REPOSITORY = 'DegreeCertificateRepository',
}

export enum DEGREE_MODALITY {
  ONLINE = 'ONL',
  PRESENCIAL = 'PRE',
}

export interface CertificateBulkCreation {
  notification: NotificationEntity
  dto: CreateDegreeCertificateBulkDto
}
