import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { DEGREE_CERTIFICATE } from '../constants'
import { DegreeCertificateRepository } from '../repositories/degree-certificate-repository'
import { DegreeCertificatesService } from './degree-certificates.service'
import { YearModuleService } from '../../year-module/year-module.service'
import { DEGREE_MODULES } from '../../shared/enums/degree-certificates'
import { Not, IsNull } from 'typeorm'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { DegreeCertificateNotFoundError } from '../errors/degree-certificate-not-found'

@Injectable()
export class CertificateNumerationService {
  constructor(
    @Inject(forwardRef(() => DegreeCertificatesService))
    private readonly degreeCertificatesService: DegreeCertificatesService,
    @Inject(DEGREE_CERTIFICATE.REPOSITORY)
    private readonly degreeCertificateRepository: DegreeCertificateRepository,
    private readonly yearModuleService: YearModuleService,
  ) {}

  async getLastNumberToRegister(carrerId: number): Promise<number> {
    const systemYear = await this.yearModuleService.getCurrentSystemYear()

    const submoduleYearModule =
      await this.yearModuleService.findSubmoduleYearModuleByModule(
        DEGREE_MODULES.MODULE_CODE,
        systemYear,
        DEGREE_MODULES.SUBMODULE_NAME,
      )

    const enqueuedNumbers = await this.getNumerationEnqueued(carrerId)

    if (enqueuedNumbers.length > 0) {
      return enqueuedNumbers[0]
    }

    const lastDegreeCertificate =
      await this.degreeCertificateRepository.findOneFor({
        where: {
          submoduleYearModule: { id: submoduleYearModule.id },
          career: { id: carrerId },
        },
        order: { auxNumber: 'DESC' },
      })

    const number = lastDegreeCertificate
      ? lastDegreeCertificate.auxNumber + 1
      : 1

    return number
  }

  async getLastNumberGenerated(
    careerId: number,
    submoduleYearModuleId: number,
  ) {
    const degreeCertificate = await this.degreeCertificateRepository.findOneFor(
      {
        where: {
          career: { id: careerId },
          submoduleYearModule: { id: submoduleYearModuleId },
          number: Not(IsNull()),
          deletedAt: null,
        },
        order: { number: 'DESC' },
      },
    )

    if (!degreeCertificate) {
      return 0
    }

    return degreeCertificate.number
  }

  async getNumerationEnqueued(careerId: number): Promise<number[]> {
    const submoduleYearModule =
      await this.degreeCertificatesService.getCurrentDegreeSubmoduleYearModule()

    const removedDegreeCertificates =
      await this.degreeCertificateRepository.findManyFor({
        where: {
          career: { id: careerId },
          submoduleYearModule: { id: submoduleYearModule.id },
          number: Not(IsNull()),
          deletedAt: Not(IsNull()),
        },
        order: { number: 'ASC' },
      })

    const numbers: number[] = []

    if (removedDegreeCertificates) {
      removedDegreeCertificates.forEach((degreeCertificate) => {
        numbers.push(degreeCertificate.number)
      })
    }

    return numbers
  }

  async generateNumeration(careerId: number) {
    const submoduleYearModule =
      await this.degreeCertificatesService.getCurrentDegreeSubmoduleYearModule()

    const degreeCertificates =
      await this.degreeCertificatesService.getCertificatesToGenerate(
        careerId,
        submoduleYearModule.id,
      )

    if (!degreeCertificates) {
      throw new DegreeCertificateNotFoundError(
        'No se encontraron certificados para generar la numeración',
      )
    }

    const lastNumber = await this.getLastNumberGenerated(
      careerId,
      submoduleYearModule.id,
    )

    let number = lastNumber

    for (const degreeCertificate of degreeCertificates) {
      number += 1

      await this.degreeCertificateRepository.save({
        ...degreeCertificate,
        number,
      })
    }

    return new ApiResponseDto('Numeración generada correctamente', {
      firstGenerated: lastNumber + 1,
      lastGenerated: number,
    })
  }
}
