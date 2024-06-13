import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull'
import { Job } from 'bull'
import { CertificateBulkService } from '../services/certificate-bulk.service'
import { Logger } from '@nestjs/common/services/logger.service'
import { CERTIFICATE_QUEUE_NAME, CertificateBulkCreation } from '../constants'
import { HttpException } from '@nestjs/common'

@Processor(CERTIFICATE_QUEUE_NAME)
export class CertificateProcessor {
  private readonly logger = new Logger(CertificateProcessor.name)

  constructor(private certificateService: CertificateBulkService) {}

  @Process('createCertificate')
  async handleCertificateCreation(job: Job<CertificateBulkCreation>) {
    this.logger.log(
      `Procesando el trabajo ${job.id} para el tema ${job.data.dto.topic}`,
    )
    try {
      const result = await this.certificateService.createDegreeCertificate(
        job.data.dto,
        job.data.notification,
        job.data.retries,
      )
      this.logger.log(`Trabajo ${job.id} completado exitosamente`)

      return result
    } catch (error) {
      Logger.error('Error HTTP:', error.message)
      if (error instanceof HttpException) {
        // es normal que ocurran errores HTTP el servicio se encarga de manejarlos, por lo que no es necesario capturarlos

        this.logger.error(
          `Error al procesar el trabajo ${job.id}: ${error.message}`,
        )
      } else {
        this.logger.error(
          `Error al procesar el trabajo ${job.id}: ${error.message}`,
          error.stack,
        )
        if (error.isRecoverable) {
          throw new Error('Temporary Google API error, retrying...') // Bull reintentará
        } else {
          // Loguea el error y lo envía al cliente sin reintentar
          this.logger.error(
            `Error irrecuperable en el trabajo ${job.id}: ${error.message}`,
          )
          // Aquí podrías emitir un evento o guardar el error en una base de datos para que el cliente pueda recuperarlo
        }
      }

      return
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Job ${job.id} started`)
  }

  @OnQueueCompleted()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  onComplete(job: Job, result: any) {
    this.logger.debug(`Job ${job.id} completed`)
  }

  @OnQueueFailed()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError(job: Job, error: any) {
    this.logger.error(`Job ${job.id} failed with error ${error.message}`)
  }

  @OnQueueProgress()
  onProgress(job: Job, progress: number) {
    this.logger.debug(`Job ${job.id} is ${progress}% complete`)
  }
}
