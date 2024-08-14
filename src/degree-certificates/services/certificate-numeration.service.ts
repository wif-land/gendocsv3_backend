import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { DEGREE_CERTIFICATE } from '../constants'
import { DegreeCertificateRepository } from '../repositories/degree-certificate-repository'
import { DegreeCertificatesService } from './degree-certificates.service'
import { YearModuleService } from '../../year-module/year-module.service'
import { DEGREE_MODULES } from '../../shared/enums/degree-certificates'
import { Not, IsNull, MoreThan } from 'typeorm'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { DegreeCertificateNotFoundError } from '../errors/degree-certificate-not-found'
import { CertificateDocumentService } from './certificate-document.service'
import { DEGREE_CERT_CURRENT_NUMERATIONS } from '../../shared/constants/degree-cert-current-numerations'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'

@Injectable()
export class CertificateNumerationService {
  constructor(
    @Inject(forwardRef(() => DegreeCertificatesService))
    private readonly degreeCertificatesService: DegreeCertificatesService,
    @Inject(DEGREE_CERTIFICATE.REPOSITORY)
    private readonly degreeCertificateRepository: DegreeCertificateRepository,
    private readonly yearModuleService: YearModuleService,
    private readonly certificateDocumentService: CertificateDocumentService,
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
          deletedAt: IsNull(),
        },
        order: { number: 'DESC' },
      },
    )

    if (!degreeCertificate) {
      const currentSystemYear =
        await this.yearModuleService.getCurrentSystemYear()

      if (currentSystemYear === 2024) {
        return DEGREE_CERT_CURRENT_NUMERATIONS[careerId]
      }
      return 0
    }

    return degreeCertificate.number
  }

  async getNumerationEnqueued(careerId: number): Promise<number[]> {
    const submoduleYearModule =
      await this.degreeCertificatesService.getCurrentDegreeSubmoduleYearModule()

    const { degreeCertificates: removedDegreeCertificates } =
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
      await this.certificateDocumentService.getCertificatesToGenerate(
        careerId,
        submoduleYearModule.id,
      )

    if (!degreeCertificates) {
      throw new DegreeCertificateNotFoundError(
        'No se encontraron certificados para generar la numeración, verifique que los certificados tengan fecha de presentación',
      )
    }

    const lastNumber = await this.getLastNumberGenerated(
      careerId,
      submoduleYearModule.id,
    )

    const enqueuedNumbers = await this.getNumerationEnqueued(careerId)

    let number =
      enqueuedNumbers.length > 0 ? enqueuedNumbers[0] - 1 : lastNumber

    await this.verifyLastNumberatedAndPresentationDate(
      careerId,
      submoduleYearModule.id,
      degreeCertificates,
      enqueuedNumbers.length > 0 ? enqueuedNumbers[0] : lastNumber,
      enqueuedNumbers.length > 0,
    )

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

  async verifyLastNumberatedAndPresentationDate(
    careerId: number,
    submoduleYearModuleId: number,
    degreeCertificates: DegreeCertificateEntity[],
    number: number,
    isEnqueued = false,
  ) {
    if (isEnqueued) {
      const nextDegreeCertificateAfterEnqueuedNumber =
        await this.degreeCertificateRepository.findManyFor({
          where: {
            career: { id: careerId },
            submoduleYearModule: { id: submoduleYearModuleId },
            number: MoreThan(number),
          },
          order: { number: 'ASC' },
        })

      const nextDegreeCertificate = nextDegreeCertificateAfterEnqueuedNumber[0]

      if (
        nextDegreeCertificate &&
        nextDegreeCertificate.presentationDate &&
        new Date(nextDegreeCertificate.presentationDate).getDate() <
          new Date(degreeCertificates[0].presentationDate).getDate()
      ) {
        throw new DegreeCertificateNotFoundError(
          `La fecha de presentación del acta para estudiante con cédula: ${degreeCertificates[0].student.dni} es menor a la fecha de presentación del acta numerada en cola`,
        )
      }
    }

    const lastDegreeCertificate =
      await this.degreeCertificateRepository.findOneFor({
        where: {
          career: { id: careerId },
          submoduleYearModule: { id: submoduleYearModuleId },
          number,
        },
      })

    if (!lastDegreeCertificate) {
      return
    }

    if (!lastDegreeCertificate.presentationDate) {
      throw new DegreeCertificateNotFoundError(
        'La fecha de presentación del acta de grado no ha sido registrada',
      )
    }

    const lastPresentationDate = lastDegreeCertificate.presentationDate

    for (const degreeCertificate of degreeCertificates) {
      const sameMonthAndYear =
        new Date(degreeCertificate.presentationDate).getMonth() ===
          new Date(lastPresentationDate).getMonth() &&
        new Date(degreeCertificate.presentationDate).getFullYear() ===
          new Date(lastPresentationDate).getFullYear()

      if (
        !lastDegreeCertificate.deletedAt &&
        sameMonthAndYear &&
        new Date(degreeCertificate.presentationDate).getDate() <
          new Date(lastPresentationDate).getDate()
      ) {
        throw new DegreeCertificateNotFoundError(
          `La fecha de presentación del acta para estudiante con cédula: ${degreeCertificate.student.dni} es menor a la fecha de presentación de la última acta numerada`,
        )
      }

      if (
        lastDegreeCertificate.deletedAt != null &&
        sameMonthAndYear &&
        new Date(degreeCertificate.presentationDate).getDate() >
          new Date(lastPresentationDate).getDate()
      ) {
        throw new DegreeCertificateNotFoundError(
          `La fecha de presentación del acta para estudiante con cédula: ${degreeCertificate.student.dni} es mayor a la fecha de presentación de la última acta eliminada, esto puede generar inconsistencias en la numeración`,
        )
      }
    }
  }
}
