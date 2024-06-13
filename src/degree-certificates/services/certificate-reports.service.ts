import { Inject, Injectable } from '@nestjs/common'
import { DEGREE_CERTIFICATE } from '../constants'
import { DegreeCertificateRepository } from '../repositories/degree-certificate-repository'

@Injectable()
export class CertificateReportsService {
  constructor(
    @Inject(DEGREE_CERTIFICATE.REPOSITORY)
    private readonly degreeCertificateRepository: DegreeCertificateRepository,
  ) {}

  generate
}
