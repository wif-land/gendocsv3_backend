import { Inject, Injectable } from '@nestjs/common'
import { DEGREE_CERTIFICATE } from '../constants'
import { DegreeCertificateRepository } from '../repositories/degree-certificate-repository'
import { Not, IsNull } from 'typeorm'
import { DegreeCertificatesService } from './degree-certificates.service'

@Injectable()
export class CertificateReportsService {
  constructor(
    @Inject(DEGREE_CERTIFICATE.REPOSITORY)
    private readonly degreeCertificateRepository: DegreeCertificateRepository,
    private readonly degreeCertificateService: DegreeCertificatesService,
  ) {}

  async getCertificatesReport(careerId: number, isEnd?: boolean) {
    const subModuleYearModule =
      await this.degreeCertificateService.getCurrentDegreeSubmoduleYearModule()
    const certificates = await this.degreeCertificateRepository.findManyFor({
      where: {
        career: { id: careerId },
        presentationDate: isEnd ? Not(IsNull()) : IsNull(),
        isClosed: false,
        deletedAt: IsNull(),
        submoduleYearModule: { id: subModuleYearModule.id },
      },
    })

    return certificates
  }
}
