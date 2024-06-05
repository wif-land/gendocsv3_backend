import { Injectable } from '@nestjs/common'
import { CreateDegreeCertificateBulkDto } from '../dto/create-degree-cretificate-bulk.dto'
import { DegreeCertificatesService } from '../degree-certificates.service'
import { StudentsService } from '../../students/students.service'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'
import { CertificateTypeService } from './certificate-type.service'
import { FunctionariesService } from '../../functionaries/functionaries.service'
import { CertificateStatusService } from './certificate-status.service'
import { DegreeModalitiesService } from './degree-modalities.service'

@Injectable()
export class CertificateBulkService {
  constructor(
    private readonly degreeCertificateService: DegreeCertificatesService,

    private readonly studentsService: StudentsService,

    private readonly certiticateTypeService: CertificateTypeService,

    private readonly functionariesService: FunctionariesService,

    private readonly certificateStatusService: CertificateStatusService,

    private readonly degreeModalitiesService: DegreeModalitiesService,
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
    // validate certificate student
    const { data: students } = await this.studentsService.findByFilters({
      field: createCertificateDto.studentDni,
      state: true,
    })

    if (students.count === 0) {
      throw new DegreeCertificateBadRequestError(
        `No existe el estudiante con cédula${createCertificateDto.studentDni}`,
      )
    }

    // // validate certificate type
    // const certificateType =
    //   await this.certiticateTypeService.findCertificateTypeByName(
    //     createCertificateDto.certificateType,
    //   )

    // // validate first main qualifier
    // const certificateStatus =
    //   await this.certificateStatusService.findCertificateStatusByName(
    //     createCertificateDto.certificateStatus,
    //   )
  }
}
