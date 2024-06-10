import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Not, Repository } from 'typeorm'
import { CreateDegreeCertificateDto } from './dto/create-degree-certificate.dto'
import { UpdateDegreeCertificateDto } from './dto/update-degree-certificate.dto'
import { CertificateTypeEntity } from './entities/certificate-type.entity'
import { DegreeCertificateEntity } from './entities/degree-certificate.entity'
import { DegreeCertificateBadRequestError } from './errors/degree-certificate-bad-request'
import { DegreeCertificateAlreadyExists } from './errors/degree-certificate-already-exists'
import { DegreeCertificateNotFoundError } from './errors/degree-certificate-not-found'
import { YearModuleService } from '../year-module/year-module.service'
import { DEGREE_MODULES } from '../shared/enums/degree-certificates'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { FilesService } from '../files/services/files.service'
import { StudentsService } from '../students/students.service'
import { StudentEntity } from '../students/entities/student.entity'
import { VariablesService } from '../variables/variables.service'
import { DegreeCertificateAttendanceService } from '../degree-certificate-attendance/degree-certificate-attendance.service'
import { DegreeCertificateConflict } from './errors/degree-certificate-conflict'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { GradesSheetService } from './services/grades-sheet.service'
import { CertificateStatusService } from './services/certificate-status.service'
import { DegreeCertificateRepository } from './repositories/degree-certificate-repository'
import { addMinutesToDate } from '../shared/utils/date'
import { RoomsService } from './services/rooms.service'

@Injectable()
export class DegreeCertificatesService {
  constructor(
    private readonly yearModuleService: YearModuleService,
    private readonly filesService: FilesService,
    private readonly studentService: StudentsService,
    private readonly roomsService: RoomsService,
    private readonly variablesService: VariablesService,
    private readonly degreeCertificateAttendanceService: DegreeCertificateAttendanceService,
    private readonly gradesSheetService: GradesSheetService,
    private readonly certificateStatusService: CertificateStatusService,

    @Inject('DegreeCertificateRepository')
    private readonly degreeCertificateRepository: DegreeCertificateRepository,

    @InjectRepository(CertificateTypeEntity)
    private readonly certificateTypeRepository: Repository<CertificateTypeEntity>,
  ) {}

  async getLastNumberToRegister(carrerId: number): Promise<number> {
    const systemYear = await this.yearModuleService.getCurrentSystemYear()

    const submoduleYearModule =
      await this.yearModuleService.findSubmoduleYearModuleByModule(
        DEGREE_MODULES.MODULE_CODE,
        systemYear,
        DEGREE_MODULES.SUBMODULE_NAME,
      )

    const lastDegreeCertificate =
      await this.degreeCertificateRepository.findOne({
        where: {
          submoduleYearModule: { id: submoduleYearModule.id },
          student: { career: { id: carrerId } },
        },
        order: { auxNumber: 'DESC' },
      })

    const number = lastDegreeCertificate
      ? lastDegreeCertificate.auxNumber + 1
      : 1

    return number
  }
  async findAll(
    paginationDto: PaginationDto,
    carrerId: number,
  ): Promise<
    ApiResponseDto<{
      count: number
      degreeCertificates: DegreeCertificateEntity[]
    }>
  > {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 10, offset = 0 } = paginationDto

    const degreeCertificates =
      await this.degreeCertificateRepository.findManyFor({
        where: {
          career: { id: carrerId },
          deletedAt: IsNull(),
        },
        take: limit,
        skip: offset,
      })

    const countQueryBuilder =
      this.degreeCertificateRepository.createQueryBuilder('degreeCertificates')
    const count = await countQueryBuilder.getCount()

    return new ApiResponseDto('Certificados de grado encontrados', {
      count,
      degreeCertificates,
    })
  }

  async checkStudent(student: StudentEntity): Promise<void> {
    const hasApproved =
      await this.degreeCertificateRepository.findApprovedByStudent(student.id)

    console.log(hasApproved)

    if (hasApproved != null && hasApproved !== undefined) {
      throw new DegreeCertificateAlreadyExists(
        `El estudiante con id ${student.id} ya cuenta con un certificado de grado aprobado`,
      )
    }

    if (
      student.gender == null ||
      student.startStudiesDate == null ||
      student.internshipHours == null ||
      student.vinculationHours == null ||
      student.approvedCredits == null
    ) {
      throw new DegreeCertificateBadRequestError(
        'Falta información. Revise el genero, fecha de inicio de estudios, horas de pasantias y horas de vinculacion del estudiante',
      )
    }

    if (
      student.approvedCredits < student.career.credits ||
      student.vinculationHours < student.career.vinculationHours ||
      student.internshipHours < student.career.internshipHours
    ) {
      throw new DegreeCertificateBadRequestError(
        `El estudiante no cumple con los requisitos para obtener el certificado de grado. Créditos aprobados: ${student.approvedCredits}, Horas de vinculación: ${student.vinculationHours}, Horas de pasantías: ${student.internshipHours}`,
      )
    }
  }

  async checkPresentationDate(
    presentationDate?: Date,
    duration?: number,
    roomId?: number,
  ) {
    if (
      roomId &&
      roomId !== null &&
      presentationDate &&
      presentationDate !== null &&
      duration &&
      duration !== null
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
    await this.checkPresentationDate(
      dto.presentationDate,
      dto.duration,
      dto.roomId,
    )

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
      auxNumber: await this.getLastNumberToRegister(student.career.id),
      student: { id: dto.studentId },
      certificateType: { id: dto.certificateTypeId },
      certificateStatus: { id: dto.certificateStatusId },
      degreeModality: { id: dto.degreeModalityId },
      room: { id: dto.roomId ? dto.roomId : null },
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

    const { data: createdDegreeCertificate } =
      await this.gradesSheetService.generateGradeSheet(relationshipCertificate)

    return new ApiResponseDto(
      'Certificado creado correctamente',
      createdDegreeCertificate,
    )
  }

  async getCertificatesToGenerate(
    careerId: number,
    submoduleYearModuleId: number,
  ) {
    const degreeCertificates = await this.degreeCertificateRepository.find({
      where: {
        submoduleYearModule: { id: submoduleYearModuleId },
        career: { id: careerId },
        deletedAt: IsNull(),
        number: IsNull(),
      },
      order: { createdAt: 'ASC' },
      relationLoadStrategy: 'join',
      relations: {
        student: true,
        career: true,
        certificateType: true,
        certificateStatus: true,
        degreeModality: true,
        room: true,
        submoduleYearModule: true,
      },
    })

    if (!degreeCertificates || degreeCertificates.length === 0) {
      return undefined
    }

    return degreeCertificates
  }

  async getLastNumberGenerated(
    careerId: number,
    submoduleYearModuleId: number,
  ) {
    const degreeCertificate = await this.degreeCertificateRepository.findOne({
      where: {
        career: { id: careerId },
        submoduleYearModule: { id: submoduleYearModuleId },
        number: Not(IsNull()),
        deletedAt: null,
      },
      order: { number: 'DESC' },
    })

    if (!degreeCertificate) {
      return 0
    }

    return degreeCertificate.number
  }

  async getCurrentDegreeSubmoduleYearModule() {
    const systemYear = await this.yearModuleService.getCurrentSystemYear()

    return await this.yearModuleService.findSubmoduleYearModuleByModule(
      DEGREE_MODULES.MODULE_CODE,
      systemYear,
      DEGREE_MODULES.SUBMODULE_NAME,
    )
  }

  async generateNumeration(careerId: number) {
    const submoduleYearModule = await this.getCurrentDegreeSubmoduleYearModule()

    const degreeCertificates = await this.getCertificatesToGenerate(
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

    const gradeCells =
      await this.gradesSheetService.getGradeCellsByCertificateType(
        degreeCertificate.certificateType.id,
      )

    const gradeCellsData = await this.gradesSheetService.getCellsVariables(
      gradeCells,
      degreeCertificate.gradesSheetDriveId,
    )

    const { data: dregreeCertificateData } =
      await this.variablesService.getDegreeCertificateVariables(
        degreeCertificate,
        attendance,
      )

    await this.filesService.replaceTextOnDocument(
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

    const degreeCertificatePreloaded =
      await this.degreeCertificateRepository.merge(degreeCertificate, {
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

    if (dto.certificateTypeId) {
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

      const { data: UpdatedCertificatedGradeSheet } =
        await this.gradesSheetService.generateGradeSheet(
          degreeCertificatePreloaded,
        )

      return new ApiResponseDto(
        'Certificado actualizado correctamente',
        UpdatedCertificatedGradeSheet,
      )
    }

    return new ApiResponseDto(
      'Certificado actualizado correctamente',
      certificateUpdated,
    )
  }
}
