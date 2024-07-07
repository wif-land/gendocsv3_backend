import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Not, Repository } from 'typeorm'
import { CreateDegreeCertificateDto } from '../dto/create-degree-certificate.dto'
import { UpdateDegreeCertificateDto } from '../dto/update-degree-certificate.dto'
import { CertificateTypeEntity } from '../entities/certificate-type.entity'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'
import { DegreeCertificateAlreadyExists } from '../errors/degree-certificate-already-exists'
import { DegreeCertificateNotFoundError } from '../errors/degree-certificate-not-found'
import { YearModuleService } from '../../year-module/year-module.service'
import {
  CERT_STATUS_CODE,
  DEGREE_ATTENDANCE_ROLES,
  DEGREE_MODULES,
} from '../../shared/enums/degree-certificates'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { FilesService } from '../../files/services/files.service'
import { StudentsService } from '../../students/students.service'
import { StudentEntity } from '../../students/entities/student.entity'
import { VariablesService } from '../../variables/variables.service'
import { DegreeAttendanceService } from '../../degree-certificate-attendance/degree-certificate-attendance.service'
import { DegreeCertificateConflict } from '../errors/degree-certificate-conflict'
import { GradesSheetService } from './grades-sheet.service'
import { CertificateStatusService } from './certificate-status.service'
import { DegreeCertificateRepository } from '../repositories/degree-certificate-repository'
import { addMinutesToDate } from '../../shared/utils/date'
import { DEGREE_CERTIFICATE, IDegreeCertificateFilters } from '../constants'
import { DegreeCertificateError } from '../errors/degree-certificate-error'
import { CertificateNumerationService } from './certificate-numeration.service'

@Injectable()
export class DegreeCertificatesService {
  constructor(
    private readonly yearModuleService: YearModuleService,
    private readonly filesService: FilesService,
    private readonly studentService: StudentsService,
    private readonly variablesService: VariablesService,
    private readonly degreeCertificateAttendanceService: DegreeAttendanceService,
    private readonly gradesSheetService: GradesSheetService,
    private readonly certificateStatusService: CertificateStatusService,
    private readonly certificateNumerationService: CertificateNumerationService,

    @Inject(DEGREE_CERTIFICATE.REPOSITORY)
    private readonly degreeCertificateRepository: DegreeCertificateRepository,

    @InjectRepository(CertificateTypeEntity)
    private readonly certificateTypeRepository: Repository<CertificateTypeEntity>,
  ) {}

  async findAll(paginationDto: IDegreeCertificateFilters): Promise<
    ApiResponseDto<{
      count: number
      degreeCertificates: DegreeCertificateEntity[]
    }>
  > {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 10, offset = 0 } = paginationDto

    const { degreeCertificates, count } =
      await this.degreeCertificateRepository.findManyFor(
        {
          where: {
            career: { id: Number(paginationDto.careerId) || Not(IsNull()) },
            deletedAt: IsNull(),
          },
          order: { auxNumber: 'ASC' },
          take: limit,
          skip: offset,
        },
        paginationDto.field,
      )

    return new ApiResponseDto('Certificados de grado encontrados', {
      count,
      degreeCertificates,
    })
  }

  async checkStudent(student: StudentEntity): Promise<void> {
    const hasApproved =
      await this.degreeCertificateRepository.findApprovedByStudent(student.id)

    if (hasApproved != null && hasApproved !== undefined) {
      throw new DegreeCertificateAlreadyExists(
        `El estudiante con dni ${student.dni} ya cuenta con un certificado de grado aprobado`,
      )
    }

    if (
      student.gender == null ||
      student.startStudiesDate == null ||
      student.internshipHours == null ||
      student.vinculationHours == null ||
      student.approvedCredits == null ||
      student.birthdate == null ||
      student.canton == null ||
      student.folio == null ||
      student.registration == null
    ) {
      throw new DegreeCertificateBadRequestError(
        'Falta información. Revise:, género, fecha de inicio de estudios, horas de pasantias y horas de vinculación, Fecha de nacimiento, Cantón, Folio, Matrícula del estudiante ',
      )
    }

    if (
      student.approvedCredits < student.career.credits ||
      student.vinculationHours < student.career.vinculationHours ||
      student.internshipHours < student.career.internshipHours
    ) {
      throw new DegreeCertificateBadRequestError(
        `El estudiante no cumple con los requisitos para obtener el certificado de grado. Créditos necesarios: ${student.career.credits}, Horas de vinculación necesarias: ${student.career.vinculationHours}, Horas de pasantías necesarias: ${student.career.internshipHours}`,
      )
    }
  }

  async checkPresentationDate({
    presentationDate,
    duration,
    roomId,
  }: {
    presentationDate?: Date
    duration?: number
    roomId?: number
  } = {}): Promise<void> {
    if (
      roomId &&
      roomId != null &&
      presentationDate &&
      presentationDate != null &&
      duration &&
      duration != null
    ) {
      const certificatesInRange =
        await this.degreeCertificateRepository.countCertificatesInDateRangeByRoom(
          presentationDate,
          addMinutesToDate(presentationDate, duration),
          roomId,
        )

      if (certificatesInRange > 0) {
        throw new DegreeCertificateBadRequestError(
          'Ya existe una acta de grado en la aula seleccionada en el rango de fechas proporcionado',
        )
      }
    }
  }

  async create(dto: CreateDegreeCertificateDto) {
    const student: StudentEntity = (
      await this.studentService.findOne(dto.studentId)
    ).data

    await this.checkStudent(student)
    await this.checkPresentationDate({
      presentationDate: dto.presentationDate,
      duration: dto.duration,
      roomId: dto.roomId,
    })

    const certificateStatusType =
      await this.certificateStatusService.findCertificateStatusType(
        dto.certificateTypeId,
        dto.certificateStatusId,
      )

    if (!certificateStatusType) {
      throw new DegreeCertificateNotFoundError(
        `No se encontró el estado de certificado ${dto.certificateTypeId} para el tipo de certificado ${dto.certificateStatusId}`,
      )
    }

    const submoduleYearModuleId =
      await this.getCurrentDegreeSubmoduleYearModule()

    const degreeCertificate = await this.degreeCertificateRepository.create({
      ...dto,
      user: { id: dto.userId },
      auxNumber:
        await this.certificateNumerationService.getLastNumberToRegister(
          student.career.id,
        ),
      student: { id: dto.studentId },
      certificateType: { id: dto.certificateTypeId },
      certificateStatus: { id: dto.certificateStatusId },
      degreeModality: { id: dto.degreeModalityId },
      room: { id: dto.roomId ? dto.roomId : null },
      duration: dto.duration ?? 60,
      submoduleYearModule: {
        id: submoduleYearModuleId.id,
      },
      career: { id: student.career.id },
      isClosed: false,
      link: dto.degreeModalityId === 1 ? dto.link : null,
    })

    if (!degreeCertificate) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del certificado son incorrectos',
      )
    }

    const newCertificate = await this.degreeCertificateRepository.save(
      degreeCertificate,
    )

    const relationshipCertificate =
      await this.degreeCertificateRepository.findOneFor({
        where: { id: newCertificate.id },
      })

    const { data: createdDegreeCertificate, error } =
      await this.gradesSheetService.generateGradeSheet(relationshipCertificate)

    if (error) {
      await this.degreeCertificateRepository.remove(relationshipCertificate)
      throw new DegreeCertificateBadRequestError(error.message)
    }

    await this.studentService.update(student.id, {
      endStudiesDate: dto.presentationDate,
    })

    return new ApiResponseDto(
      'Certificado creado correctamente',
      createdDegreeCertificate,
    )
  }

  async getCertificatesToGenerate(
    careerId: number,
    submoduleYearModuleId: number,
  ) {
    const { degreeCertificates } =
      await this.degreeCertificateRepository.findManyFor({
        where: {
          submoduleYearModule: { id: submoduleYearModuleId },
          career: { id: careerId },
          deletedAt: IsNull(),
          number: IsNull(),
        },
        order: { createdAt: 'ASC' },
      })

    if (!degreeCertificates || degreeCertificates.length === 0) {
      return undefined
    }

    return degreeCertificates
  }

  async getCurrentDegreeSubmoduleYearModule() {
    const systemYear = await this.yearModuleService.getCurrentSystemYear()

    return await this.yearModuleService.findSubmoduleYearModuleByModule(
      DEGREE_MODULES.MODULE_CODE,
      systemYear,
      DEGREE_MODULES.SUBMODULE_NAME,
    )
  }

  async generateDocument(id: number) {
    const degreeCertificate = await this.degreeCertificateRepository.findOneFor(
      {
        where: { id },
      },
    )

    if (!degreeCertificate) {
      throw new DegreeCertificateNotFoundError(
        `El certificado con id ${id} no existe`,
      )
    }

    if (
      await this.getCertificatesToGenerate(
        degreeCertificate.career.id,
        degreeCertificate.submoduleYearModule.id,
      )
    ) {
      throw new DegreeCertificateBadRequestError(
        'Se deben generar los números de registro antes de generar los documentos',
      )
    }

    if (!degreeCertificate.presentationDate) {
      throw new DegreeCertificateBadRequestError(
        'El certificado no cuenta con una fecha de presentación',
      )
    }

    const certificateStatusType =
      await this.certificateStatusService.findCertificateStatusType(
        degreeCertificate.certificateType.id,
        degreeCertificate.certificateStatus.id,
      )

    if (!certificateStatusType) {
      throw new DegreeCertificateNotFoundError(
        `No se encontró el estado de certificado ${degreeCertificate.certificateStatus.code} para el tipo de certificado ${degreeCertificate.certificateType.name}`,
      )
    }

    if (
      degreeCertificate.student.gender == null ||
      degreeCertificate.student.endStudiesDate == null ||
      degreeCertificate.student.startStudiesDate == null ||
      degreeCertificate.student.internshipHours == null ||
      degreeCertificate.student.vinculationHours == null
    ) {
      throw new DegreeCertificateBadRequestError(
        'El estudiante no cuenta con la información necesaria para generar la acta de grado',
      )
    }

    if (degreeCertificate.gradesSheetDriveId == null) {
      throw new DegreeCertificateBadRequestError(
        'La acta de grado no cuenta con la hoja de calificaciones',
      )
    }

    const { data: attendance } =
      await this.degreeCertificateAttendanceService.findByDegreeCertificate(
        degreeCertificate.id,
      )

    if (!attendance || attendance.length === 0) {
      throw new DegreeCertificateBadRequestError(
        'No se encontró la asistencia al acta de grado',
      )
    }

    const representan = attendance.find(
      (a) => a.role === DEGREE_ATTENDANCE_ROLES.PRESIDENT,
    )

    if (!representan) {
      throw new DegreeCertificateBadRequestError(
        'No se encontró el representante de la mesa directiva en la asistencia al acta de grado',
      )
    }

    const gradeCells =
      await this.gradesSheetService.getGradeCellsByCertificateType(
        degreeCertificate.certificateType.id,
      )

    const finalGrade = gradeCells.find(
      (cell) =>
        cell.gradeVariable === 'NOTAFINAL' ||
        cell.gradeVariable === 'NOTAGRADO',
    )

    if (!finalGrade) {
      throw new DegreeCertificateBadRequestError(
        'No se encontró la celda de calificación para la nota final o la nota de grado',
      )
    }

    const gradeCellsData = await this.gradesSheetService.getCellsVariables(
      gradeCells,
      degreeCertificate.gradesSheetDriveId,
    )

    if (
      !gradeCellsData[`{{${finalGrade.gradeVariable}}}`] ||
      gradeCellsData[`{{${finalGrade.gradeVariable}}}`] == null ||
      gradeCellsData[`{{${finalGrade.gradeVariable}}}`] === ''
    ) {
      throw new DegreeCertificateBadRequestError(
        'La hoja de calificaciones no cuenta con la nota final o la nota de grado',
      )
    }

    const finalGradeValue = parseFloat(
      gradeCellsData[`{{${finalGrade.gradeVariable}}}`],
    )

    if (finalGradeValue < 0 || finalGradeValue > 10) {
      throw new DegreeCertificateBadRequestError(
        `La nota final o la nota de grado: ${finalGradeValue} no es válida`,
      )
    }

    if (
      finalGradeValue < 7 &&
      certificateStatusType.certificateStatus.code === CERT_STATUS_CODE.APRO
    ) {
      throw new DegreeCertificateBadRequestError(
        `La nota final o la nota de grado: ${finalGradeValue} no es suficiente para aprobar el certificado`,
      )
    }

    if (
      finalGradeValue >= 7 &&
      certificateStatusType.certificateStatus.code === CERT_STATUS_CODE.REPR
    ) {
      throw new DegreeCertificateBadRequestError(
        `La nota final o la nota de grado: ${finalGradeValue} es suficiente para aprobar el certificado`,
      )
    }

    const { data: driveId } =
      await this.filesService.createDocumentByParentIdAndCopy(
        `${degreeCertificate.number} - ${degreeCertificate.student.dni} | ${degreeCertificate.certificateType.code} - ${degreeCertificate.certificateStatus.code}`,
        degreeCertificate.submoduleYearModule.driveId,
        certificateStatusType.driveId,
      )

    if (!driveId) {
      throw new DegreeCertificateBadRequestError(
        'Error al generar el documento en Google Drive',
      )
    }

    const { data: dregreeCertificateData } =
      await this.variablesService.getDegreeCertificateVariables(
        degreeCertificate,
        attendance,
      )

    this.filesService.replaceTextOnDocument(
      {
        ...dregreeCertificateData,
        ...gradeCellsData,
      },
      driveId,
    )

    const degreeCertificateUpdated =
      await this.degreeCertificateRepository.save({
        ...degreeCertificate,
        certificateDriveId: driveId,
      })

    return new ApiResponseDto(
      'Documento generado correctamente',
      degreeCertificateUpdated,
    )
  }

  async update(id: number, dto: UpdateDegreeCertificateDto) {
    const degreeCertificate = await this.degreeCertificateRepository.findOneFor(
      {
        where: { id },
      },
    )

    if (!degreeCertificate) {
      throw new DegreeCertificateNotFoundError(
        `El certificado con id ${id} no existe`,
      )
    }

    const currentDegreeCertigicate = { ...degreeCertificate }
    try {
      if (
        dto.studentId &&
        dto.studentId !== currentDegreeCertigicate.student.id
      ) {
        const student = await this.studentService.findOne(dto.studentId)

        await this.checkStudent(student.data)

        await this.studentService.update(student.data.id, {
          endStudiesDate: dto.presentationDate,
        })

        Object.defineProperty(dto, 'career', {
          value: { id: student.data.career.id },
        })
      }

      if (
        dto.presentationDate &&
        dto.presentationDate !== currentDegreeCertigicate.presentationDate
      ) {
        await this.checkPresentationDate({
          presentationDate: dto.presentationDate,
          duration: dto.duration,
          roomId: dto.roomId,
        })
      }

      const degreeCertificatePreloaded =
        await this.degreeCertificateRepository.preload({
          ...currentDegreeCertigicate,
          ...dto,
          student: { id: dto.studentId },
          certificateType: { id: dto.certificateTypeId },
          certificateStatus: { id: dto.certificateStatusId },
          degreeModality: { id: dto.degreeModalityId },
          room: { id: dto.roomId },
          link: dto.degreeModalityId === 1 ? dto.link : null,
        })

      if (!degreeCertificatePreloaded) {
        throw new DegreeCertificateBadRequestError(
          'Los datos del certificado son incorrectos',
        )
      }

      const certificateUpdated = await this.degreeCertificateRepository.save(
        degreeCertificatePreloaded,
      )

      if (
        dto.certificateTypeId &&
        currentDegreeCertigicate.certificateType.id !== dto.certificateTypeId
      ) {
        const certificateType = await this.certificateTypeRepository.findOneBy({
          id: dto.certificateTypeId,
        })

        if (!certificateType) {
          throw new DegreeCertificateNotFoundError(
            `El tipo de certificado con id ${dto.certificateTypeId} no existe`,
          )
        }

        // eslint-disable-next-line no-extra-parens
        if (
          // eslint-disable-next-line no-extra-parens
          !(await this.gradesSheetService.revokeGradeSheet(certificateUpdated))
        ) {
          throw new DegreeCertificateConflict(
            'No se pudo anular la hoja de notas anterior del certificado',
          )
        }

        const { error } = await this.gradesSheetService.generateGradeSheet(
          degreeCertificatePreloaded,
        )

        if (error) {
          throw new DegreeCertificateBadRequestError(error.message)
        }
      }
      if (
        // eslint-disable-next-line no-extra-parens
        (dto.presentationDate !== undefined &&
          // eslint-disable-next-line eqeqeq
          dto.presentationDate != currentDegreeCertigicate.presentationDate) ||
        // eslint-disable-next-line no-extra-parens
        (dto.certificateStatusId &&
          dto.certificateStatusId !==
            currentDegreeCertigicate.certificateStatus.id)
      ) {
        if (currentDegreeCertigicate.certificateDriveId) {
          await this.filesService.remove(degreeCertificate.certificateDriveId)

          await this.generateDocument(certificateUpdated.id)
        }

        await this.studentService.update(certificateUpdated.student.id, {
          endStudiesDate: dto.presentationDate,
        })
      }

      return new ApiResponseDto(
        'Certificado actualizado correctamente',
        certificateUpdated,
      )
    } catch (error) {
      await this.degreeCertificateRepository.save(currentDegreeCertigicate)
      if (error instanceof DegreeCertificateError) {
        throw error
      }

      Logger.error(error.message, error.stack)

      throw new DegreeCertificateBadRequestError(
        'Error al actualizar el certificado',
      )
    }
  }

  async remove(id: number) {
    const degreeCertificate = await this.degreeCertificateRepository.findOneFor(
      {
        where: { id },
      },
    )

    if (!degreeCertificate) {
      throw new DegreeCertificateNotFoundError(
        `El certificado con id ${id} no existe`,
      )
    }

    const degreeCertificateUpdated =
      await this.degreeCertificateRepository.save({
        ...degreeCertificate,
        gradesSheetDriveId: null,
        deletedAt: new Date(),
      })

    const { data: attendance } =
      await this.degreeCertificateAttendanceService.findByDegreeCertificate(
        degreeCertificate.id,
      )

    if (attendance) {
      await this.degreeCertificateAttendanceService.removeAllAttendanceByDegreeCertificateId(
        degreeCertificate.id,
      )
    }

    if (degreeCertificate.certificateDriveId) {
      await this.filesService.remove(degreeCertificate.certificateDriveId)
    }

    return new ApiResponseDto(
      'Certificado eliminado correctamente',
      degreeCertificateUpdated,
    )
  }

  async findById(id: number) {
    const degreeCertificate = await this.degreeCertificateRepository.findOneFor(
      {
        where: { id },
      },
    )

    if (!degreeCertificate) {
      throw new DegreeCertificateNotFoundError(
        `El certificado con id ${id} no existe`,
      )
    }

    return degreeCertificate
  }
}
