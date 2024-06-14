import { Inject, Injectable } from '@nestjs/common'
import { DEGREE_CERTIFICATE, IDegreeCertificateFilters } from '../constants'
import { DegreeCertificateRepository } from '../repositories/degree-certificate-repository'
import { Not, IsNull, Between } from 'typeorm'
import { DegreeCertificatesService } from './degree-certificates.service'
import { FilesService } from '../../files/services/files.service'
import { MIMETYPES } from '../../shared/constants/mime-types'
import { getTempProjectPath } from '../../shared/helpers/path-helper'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'
import { getFullName, getFullNameWithTitles } from '../../shared/utils/string'
import { DegreeCertificateAttendanceService } from '../../degree-certificate-attendance/degree-certificate-attendance.service'
import { DEGREE_ATTENDANCE_ROLES } from '../../shared/enums/degree-certificates'
import { formatDate, formatTime } from '../../shared/utils/date'
import { DATE_TYPES } from '../../councils/dto/council-filters.dto'

@Injectable()
export class CertificateReportsService {
  constructor(
    @Inject(DEGREE_CERTIFICATE.REPOSITORY)
    private readonly degreeCertificateRepository: DegreeCertificateRepository,
    private readonly degreeCertificateService: DegreeCertificatesService,
    private readonly filesService: FilesService,
    private readonly certificateAttendanceService: DegreeCertificateAttendanceService,
  ) {}

  async getCertificatesReport(
    degreeCertificateFilters: IDegreeCertificateFilters,
  ) {
    const { careerId, startDate, endDate, dateType } = degreeCertificateFilters

    console.log(
      dateType === DATE_TYPES.CREATION
        ? Between(startDate, endDate)
        : undefined,
    )

    const subModuleYearModule =
      await this.degreeCertificateService.getCurrentDegreeSubmoduleYearModule()
    const certificates = await this.degreeCertificateRepository.findManyFor({
      where: {
        career: { id: +careerId },
        presentationDate:
          dateType === DATE_TYPES.CREATION ? Not(IsNull()) : IsNull(),
        isClosed: false,
        deletedAt: IsNull(),
        submoduleYearModule: { id: subModuleYearModule.id },
        createdAt:
          dateType === DATE_TYPES.CREATION
            ? Between(startDate, endDate)
            : Not(IsNull()),
      },
      order: { createdAt: 'ASC' },
    })

    return certificates
  }

  async generateCertificateReport(
    degreeCertificateFilters: IDegreeCertificateFilters,
  ) {
    const submoduleYearModule =
      await this.degreeCertificateService.getCurrentDegreeSubmoduleYearModule()
    const reportTemplateId =
      submoduleYearModule.yearModule.module.reportTemplateDriveId

    const certificatesPromise = this.getCertificatesReport(
      degreeCertificateFilters,
    )

    const reportTemplate = this.filesService.exportAsset(
      reportTemplateId,
      MIMETYPES.XLSX,
    )

    const tempPath = await this.filesService.resolveDirectory(
      getTempProjectPath(),
    )

    const reportTemplateDownloaded =
      await this.filesService.saveDownloadedDocument(
        `Reporte-${
          degreeCertificateFilters.endDate ? 'final' : 'inicial'
        }.xlsx`,
        tempPath,
        await reportTemplate,
      )

    const { degreeCertificates } = await certificatesPromise

    const reportsData = await Promise.all(
      this.generateCertificateReportDataObject(degreeCertificates),
    )

    const careerNameData = {
      '{{NOMBRE_CARRERA}}': degreeCertificates[0].career.name.toUpperCase(),
    }

    const reportFile = await this.filesService.createExcelReportFromTemplate(
      reportsData,
      reportTemplateDownloaded,
      careerNameData,
    )

    return this.filesService.getFileBufferFromPath(reportFile)
  }

  generateCertificateReportDataObject(certificates: DegreeCertificateEntity[]) {
    return certificates.map(async (certificate, index) => {
      const { data: attendance } =
        await this.certificateAttendanceService.findByDegreeCertificate(
          certificate.id,
        )

      const representant = attendance?.find(
        (item) => item.role === DEGREE_ATTENDANCE_ROLES.PRESIDENT,
      )
      const representantName = representant
        ? getFullName(representant.functionary)
        : ''

      const mentor = attendance?.find(
        (item) => item.role === DEGREE_ATTENDANCE_ROLES.MENTOR,
      )

      const mentorName = mentor ? getFullNameWithTitles(mentor.functionary) : ''

      const firstMainMember = attendance?.find(
        (item) => item.role === DEGREE_ATTENDANCE_ROLES.PRINCIPAL,
      )

      const firstMainMemberName = firstMainMember
        ? getFullNameWithTitles(firstMainMember.functionary)
        : ''

      const secondMainMember = attendance?.find(
        (item) =>
          item.role === DEGREE_ATTENDANCE_ROLES.PRINCIPAL &&
          item.functionary.id !== firstMainMember?.functionary.id,
      )

      const secondMainMemberName = secondMainMember
        ? getFullNameWithTitles(secondMainMember.functionary)
        : ''

      const firstSubstituteMember = attendance?.find(
        (item) => item.role === DEGREE_ATTENDANCE_ROLES.SUBSTITUTE,
      )

      const firstSubstituteMemberName = firstSubstituteMember
        ? getFullNameWithTitles(firstSubstituteMember.functionary)
        : ''

      const secondSubstituteMember = attendance?.find(
        (item) =>
          item.role === DEGREE_ATTENDANCE_ROLES.SUBSTITUTE &&
          item.functionary.id !== firstSubstituteMember?.functionary.id,
      )

      const secondSubstituteMemberName = secondSubstituteMember
        ? getFullNameWithTitles(secondSubstituteMember.functionary)
        : ''

      const presentationDate = certificate.presentationDate
        ? `${formatDate(new Date(certificate.presentationDate))}`
        : ''

      const presentationTime = certificate.presentationDate
        ? `${formatTime(new Date(certificate.presentationDate))}`
        : ''

      return {
        index: (index + 1).toString(),
        dni: certificate.student.dni,
        studentName: getFullName(certificate.student),
        representantName,
        degreeModality: certificate.degreeModality.name.toUpperCase(),
        mentorName,
        topic: certificate.topic,
        firstMainMemberName,
        secondMainMemberName,
        firstSubstituteMemberName,
        secondSubstituteMemberName,
        presentationDate,
        presentationTime,
        room: certificate.room?.name ? certificate.room.name : '',
      }
    })
  }
}
