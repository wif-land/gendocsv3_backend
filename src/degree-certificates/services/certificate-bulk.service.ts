import { Injectable } from '@nestjs/common'
import { CreateDegreeCertificateBulkDto } from '../dto/create-degree-cretificate-bulk.dto'
import { DegreeCertificatesService } from '../degree-certificates.service'
import { StudentsService } from '../../students/students.service'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'

@Injectable()
export class CertificateBulkService {
  constructor(
    private readonly degreeCertificateService: DegreeCertificatesService,

    private readonly studentsService: StudentsService,
  ) {}
  async createBulkCertificates(
    createCertificatesDtos: CreateDegreeCertificateBulkDto[],
  ) {
    // create bulk certificates
    createCertificatesDtos.forEach(async (createCertificateDto) => {
      await this.createDegreeCertificate(createCertificateDto)
    })
  }

  async createDegreeCertificate(
    createCertificateDto: CreateDegreeCertificateBulkDto,
  ) {
    await this.validateCertificate(createCertificateDto)
  }
  async validateCertificate(
    createCertificateDto: CreateDegreeCertificateBulkDto,
  ) {
    // validate certificate
    const { data: students } = await this.studentsService.findByFilters({
      field: 'dni',
      state: true,
    })

    if (students.count === 0) {
      throw new DegreeCertificateBadRequestError(
        `No existe el estudiante con cédula${createCertificateDto.studentDni}`,
      )
    }
  }
}
