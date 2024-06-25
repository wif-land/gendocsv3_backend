import { NotificationEntity } from '../notifications/entities/notification.entity'
import { DocumentEntity } from './entities/document.entity'

export const DOCUMENT_QUEUE_NAME = 'DOCUMENT_QUEUE'

export interface DocumentRecreation {
  notification: NotificationEntity
  document: DocumentEntity
  councilVariablesData: { [key: string]: string }
}
