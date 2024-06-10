import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull'
import { Job } from 'bull'
import { CreateDegreeCertificateBulkDto } from '../dto/create-degree-certificate-bulk.dto'
import { CertificateBulkService } from '../services/certificate-bulk.service'
import { Logger } from '@nestjs/common/services/logger.service'

@Processor('certificateQueue')
export class CertificateProcessor {
  private readonly logger = new Logger(CertificateProcessor.name)

  constructor(private certificateService: CertificateBulkService) {}

  @Process('createCertificate')
  async handleCertificateCreation(job: Job<CreateDegreeCertificateBulkDto>) {
    this.logger.log(
      `Procesando el trabajo ${job.id} para el tema ${job.data.topic}`,
    )
    try {
      const result = await this.certificateService.createDegreeCertificate(
        job.data,
      )
      this.logger.log(`Trabajo ${job.id} completado exitosamente`)

      return result
    } catch (error) {
      this.logger.error(
        `Error al procesar el trabajo ${job.id}: ${error.message}`,
        error.stack,
      )
      throw error
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
