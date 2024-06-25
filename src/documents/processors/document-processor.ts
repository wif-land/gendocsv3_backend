import { Process, Processor } from '@nestjs/bull'
import { DOCUMENT_QUEUE_NAME, DocumentRecreation } from '../constants'
import { Logger } from '@nestjs/common/services/logger.service'
import { DocumentsService } from '../services/documents.service'
import { Job } from 'bull'

@Processor(DOCUMENT_QUEUE_NAME)
export class DocumentProcessor {
  private readonly logger = new Logger(DocumentProcessor.name)

  constructor(private readonly documentsService: DocumentsService) {}

  @Process('recreateDocument')
  async handleDocumentRecreation(job: Job<DocumentRecreation>) {
    this.logger.log(
      `Procesando job ${job.id} para el documento ${job.data.document.id}`,
    )
    try {
      const result = await this.documentsService.recreateDocument(
        job.data.notification,
        job.data.document,
        job.data.councilVariablesData,
      )
      this.logger.log(`Job ${job.id} completado exitosamente`)

      return result
    } catch (error) {
      this.logger.error(
        `Error al procesar el job ${job.id}: ${error.message}`,
        error.stack,
      )
      if (error.isRecoverable) {
        throw new Error('Temporary Google API error, retrying...') // Bull will retry
      } else {
        this.logger.error(
          `Error no recuperable job ${job.id}: ${error.message}`,
        )
      }

      return
    }
  }
}
