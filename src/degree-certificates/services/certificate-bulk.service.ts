import { Injectable } from '@nestjs/common'
import { CreateDegreeCertificateBulkDto } from '../dto/create-degree-cretificate-bulk.dto'
import { DegreeCertificatesService } from '../degree-certificates.service'
import { StudentsService } from '../../students/students.service'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'
import { CertificateTypeService } from './certificate-type.service'
import { FunctionariesService } from '../../functionaries/functionaries.service'
import { CertificateStatusService } from './certificate-status.service'
import { DegreeModalitiesService } from './degree-modalities.service'
import { getSTATUS_CODE_BY_CERT_STATUS } from '../../shared/enums/genders'
import { DegreeCertificateRepository } from '../repositories/degree-certificate-repository'
import { DEGREE_MODALITY } from '../constants'
import { CertificateTypeEntity } from '../entities/certificate-type.entity'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DegreeCertificateAttendanceService } from '../../degree-certificate-attendance/degree-certificate-attendance.service'
import { DegreeCertificateAttendanceEntity } from '../../degree-certificate-attendance/entities/degree-certificate-attendance.entity'
import { DataSource } from 'typeorm'
import { DEGREE_ATTENDANCE_ROLES } from '../../shared/enums/degree-certificates'
import { CertificateStatusEntity } from '../entities/certificate-status.entity'
import { DegreeModalityEntity } from '../entities/degree-modality.entity'
import { StudentEntity } from '../../students/entities/student.entity'

@Injectable()
export class CertificateBulkService {
  constructor(
    private readonly degreeCertificateService: DegreeCertificatesService,

    private readonly studentsService: StudentsService,

    private readonly certiticateTypeService: CertificateTypeService,

    private readonly functionariesService: FunctionariesService,

    private readonly certificateStatusService: CertificateStatusService,

    private readonly degreeModalitiesService: DegreeModalitiesService,

    private readonly degreeCertificateAttendanceService: DegreeCertificateAttendanceService,

    @InjectRepository(DegreeCertificateEntity)
    private readonly degreeCertificateRepository: DegreeCertificateRepository,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createBulkCertificates(
    createCertificatesDtos: CreateDegreeCertificateBulkDto[],
  ): Promise<
    { message: string; errors?: DegreeCertificateBadRequestError[] }[]
  > {
    const responses: {
      message: string
      errors?: DegreeCertificateBadRequestError[]
    }[] = []
    // create bulk certificates
    createCertificatesDtos.forEach(async (createCertificateDto) => {
      const { degreeCertificate, errors } = await this.createDegreeCertificate(
        createCertificateDto,
      )

      if (!degreeCertificate) {
        responses.push({
          message: `No se pudo crear el certificado de grado con el tema ${createCertificateDto.topic}`,
          errors,
        })

        return
      }

      if (degreeCertificate && errors.length > 0) {
        responses.push({
          message: `Se creó el certificado de grado con el tema ${createCertificateDto.topic} pero con conflictos`,
          errors,
        })

        return
      }

      responses.push({
        message: `Certificado de grado con el tema ${createCertificateDto.topic} creado exitosamente`,
      })
    })

    return responses
  }

  async createDegreeCertificate(
    createCertificateDto: CreateDegreeCertificateBulkDto,
  ): Promise<
    | {
        degreeCertificate: DegreeCertificateEntity
        attendance: DegreeCertificateAttendanceEntity[]
        errors: DegreeCertificateBadRequestError[]
      }
    | {
        errors: DegreeCertificateBadRequestError[]
        degreeCertificate?: undefined
        attendance?: undefined
      }
  > {
    const errors: DegreeCertificateBadRequestError[] = []
    // validate certificate student
    const students = await this.validateStudent(
      createCertificateDto.studentDni,
      errors,
    )
    // validate certificate type
    const certificateType = await this.validateCertificateType(
      createCertificateDto.certificateType,
      errors,
    )

    // validate certificate status
    const certificateStatus = await this.validateCertificateStatus(
      createCertificateDto.certificateStatus,
      errors,
    )

    const degreeModality =
      createCertificateDto.link !== '' ||
      createCertificateDto.link !== null ||
      createCertificateDto.link !== undefined
        ? DEGREE_MODALITY.ONLINE
        : DEGREE_MODALITY.PRESENCIAL

    // Validate degree modality
    const degreeModalityEntity = await this.validateDegreeModality(
      degreeModality,
      errors,
    )
    // start transaction
    const queryRunner = this.dataSource.manager.connection.createQueryRunner()

    await queryRunner.startTransaction()
    try {
      const { degreeCertificate } = await this.validateCertificate(
        createCertificateDto,
        students.students[0],
        certificateType,
        certificateStatus,
        degreeModalityEntity,
        errors,
      )

      const attendance = await this.generateAttendance(
        createCertificateDto,
        degreeCertificate,
        errors,
      )

      return { degreeCertificate, attendance, errors }

      // TODO: Refactor this
      // TODO: variables para hoja de notas (columna notas, celda con el nombre de la variable de nota y el valor de la nota. Ej. Nota1:4.5)
      // TODO: Cargar plantilla de formato de subida de datos de acta y mostrarla
      // TODO: Actualizar fecha de fin de estudios del estudiante que sea igual a la fecha de presentación del acta
      // TODO: Formato de texto de notificación de asistencia a consejos y actas, en actas incluir el lugar fecha y hora
      // TODO: Al crear una carrera crear un modulo, crear automáticamente las relaciones con submódulos y años	y módulos y las carpetas de drive de los mismos, copiar plantillas de tipos de actas junto con las hojas de calculo de las notas del tipo de acta, en base a la ultima carrera creada y modulo creado
      // TODO: Implementar control de sesiones de usuario para reinicio automático de año
      // TODO: Implementar batched jobs para la creación de actas de grado y notificar creación y errores al usuario que subió el archivo
      // TODO: Implementar control de asistencia de actas de grado por lugar, fecha, hora y docente y estado de asistencia
      // TODO: Al notificar a los docentes de la asistencia a actas de grado, realizar el control de asistencia mencionado en el punto anterior
      // INFO: Existen 3 etapas de inicio, 1. Inicio de proyecto en producción(Corre migraciones y ejecuta endpoint para crear las carpetas en el drive de cada módulo y submódulo), 2. Reinicio Anual (Cambia el año del sistema en la tabla de la bd, y ejecuta endpoint para crear los modulos y submódulos por año y las carpetas en el drive de cada módulo y submódulo de ese año), 3. Creación de una carrera y por ende un módulo ( Ejecuta endpoint para crear los submódulos y años y módulos y las carpetas en el drive de cada módulo y submódulo de ese año para la carrera creada y copia las plantillas generales para tipos de acta de grado y consejos y plantillas en base al últimos módulo creado)
    } catch (error) {
      errors.push(
        new DegreeCertificateBadRequestError(
          'No se pudo crear el certificado de grado',
        ),
      )

      await queryRunner.rollbackTransaction()
      return { errors }
    }
  }

  async validateCertificate(
    createCertificateDto: CreateDegreeCertificateBulkDto,
    student: StudentEntity,
    certificateType: CertificateTypeEntity,
    certificateStatus: CertificateStatusEntity,
    degreeModalityEntity: DegreeModalityEntity,
    errors: DegreeCertificateBadRequestError[],
  ): Promise<{
    degreeCertificate?: DegreeCertificateEntity
    errors: DegreeCertificateBadRequestError[]
  }> {
    let degreeCertificate: DegreeCertificateEntity

    degreeCertificate = await this.degreeCertificateRepository.findReplicate({
      topic: createCertificateDto.topic,
      studentId: student.id,
      certificateTypeId: certificateType.id,
      degreeModalityId: degreeModalityEntity.id,
    })

    const degreeCertificateData = await this.getDegreeCertificateData({
      createCertificateDto,
      studentId: student.id,
      careerId: student.career.id,
      certificateTypeId: certificateType.id,
      degreeModalityId: degreeModalityEntity.id,
      certificateStatusId: certificateStatus.id,
    })

    if (degreeCertificate == null || degreeCertificate === undefined) {
      degreeCertificate = this.degreeCertificateRepository.create(
        degreeCertificateData,
      )

      if (!degreeCertificate) {
        errors.push(
          new DegreeCertificateBadRequestError(
            'Los datos del certificado son incorrectos',
          ),
        )

        return { errors }
      }

      degreeCertificate = await this.degreeCertificateRepository.save(
        degreeCertificate,
      )
    } else {
      degreeCertificate = await this.degreeCertificateRepository.save({
        ...degreeCertificate,
        ...degreeCertificateData,
      })

      if (!degreeCertificate) {
        errors.push(
          new DegreeCertificateBadRequestError(
            'Los datos del certificado son incorrectos',
          ),
        )

        return { errors }
      }
    }

    return { degreeCertificate, errors }
  }

  async validateStudent(
    studentDni: string,
    errors: DegreeCertificateBadRequestError[],
  ) {
    const { data: students } = await this.studentsService.findByFilters({
      field: studentDni,
      state: true,
    })

    if (students.count === 0) {
      errors.push(
        new DegreeCertificateBadRequestError(
          `No existe el estudiante con cédula${studentDni}`,
        ),
      )
    }

    return students
  }

  async validateCertificateType(
    certificateType: string,
    errors: DegreeCertificateBadRequestError[],
  ) {
    let certificateTypeEntity: CertificateTypeEntity
    try {
      certificateTypeEntity =
        await this.certiticateTypeService.findCertificateTypeByName(
          certificateType.toUpperCase(),
        )
    } catch (error) {
      errors.push(
        new DegreeCertificateBadRequestError(
          `No existe el tipo de certificado ${certificateType}`,
        ),
      )
    }

    return certificateTypeEntity
  }

  async validateCertificateStatus(
    certificateStatus: string,
    errors: DegreeCertificateBadRequestError[],
  ) {
    let certificateStatusEntity
    const certificateTypeStatusCode =
      getSTATUS_CODE_BY_CERT_STATUS(certificateStatus)
    try {
      certificateStatusEntity =
        await this.certificateStatusService.findCertificateStatusByCode(
          certificateTypeStatusCode,
        )
    } catch (error) {
      errors.push(
        new DegreeCertificateBadRequestError(
          `No existe el estado de certificado ${certificateStatus}`,
        ),
      )
    }

    return certificateStatusEntity
  }

  async validateDegreeModality(
    degreeModality: string,
    errors: DegreeCertificateBadRequestError[],
  ) {
    let degreeModalityEntity
    try {
      degreeModalityEntity =
        await this.degreeModalitiesService.findDegreeModalityByCode(
          degreeModality,
        )
    } catch (error) {
      errors.push(
        new DegreeCertificateBadRequestError(
          `No existe la modalidad de grado ${degreeModality}`,
        ),
      )
    }

    return degreeModalityEntity
  }

  async getDegreeCertificateData({
    createCertificateDto,
    studentId,
    careerId,
    certificateTypeId,
    degreeModalityId,
    certificateStatusId,
  }: {
    createCertificateDto: CreateDegreeCertificateBulkDto
    studentId: number
    careerId: number
    certificateTypeId: number
    degreeModalityId: number
    certificateStatusId: number
  }) {
    return {
      auxNumber: await this.degreeCertificateService.getLastNumberToRegister(
        careerId,
      ),
      topic: createCertificateDto.topic,
      presentationDate:
        createCertificateDto.presentationDate !== null ||
        createCertificateDto.presentationDate !== undefined
          ? createCertificateDto.presentationDate
          : undefined,
      student: { id: studentId },
      career: { id: careerId },
      certificateType: { id: certificateTypeId },
      certificateStatus: { id: certificateStatusId },
      degreeModality: { id: degreeModalityId },
      link:
        createCertificateDto.link !== '' ||
        createCertificateDto.link !== null ||
        createCertificateDto.link !== undefined
          ? createCertificateDto.link
          : undefined,
      submoduleYearModule: {
        id: (
          await this.degreeCertificateService.getCurrentDegreeSubmoduleYearModule()
        ).id,
      },
    }
  }

  async generateAttendance(
    createCertificateDto: CreateDegreeCertificateBulkDto,
    degreeCertificate: DegreeCertificateEntity,
    errors,
  ): Promise<DegreeCertificateAttendanceEntity[]> {
    let attendance: DegreeCertificateAttendanceEntity[]

    try {
      await this.degreeCertificateAttendanceService.removeAllAttendanceByDegreeCertificateId(
        degreeCertificate.id,
      )
    } catch (error) {
      errors.push(
        new DegreeCertificateBadRequestError(
          'No se pudo actualizar la asistencia al acta de grado',
        ),
      )
    }

    // validate first main qualifier
    const { data: firstMainQualifier } =
      await this.functionariesService.findByFilters({
        field: createCertificateDto.firstMainQualifierDni,
        state: true,
      })

    if (firstMainQualifier.count === 0) {
      errors.push(
        new DegreeCertificateBadRequestError(
          `No existe el calificador principal con cédula ${createCertificateDto.firstMainQualifierDni}`,
        ),
      )
    }

    const { data: firstAttendance } =
      await this.degreeCertificateAttendanceService.create({
        assignationDate: new Date(),
        degreeCertificateId: degreeCertificate.id,
        functionaryId: firstMainQualifier.functionaries[0].id,
        details: createCertificateDto.qualifiersResolution,
        role: DEGREE_ATTENDANCE_ROLES.PRINCIPAL,
      })

    attendance.push(firstAttendance)

    // validate second main qualifier
    const { data: secondMainQualifier } =
      await this.functionariesService.findByFilters({
        field: createCertificateDto.secondMainQualifierDni,
        state: true,
      })

    if (secondMainQualifier.count === 0) {
      errors.push(
        new DegreeCertificateBadRequestError(
          `No existe el calificador principal con cédula ${createCertificateDto.secondMainQualifierDni}`,
        ),
      )
    }

    const { data: secondAttendance } =
      await this.degreeCertificateAttendanceService.create({
        assignationDate: new Date(),
        degreeCertificateId: degreeCertificate.id,
        functionaryId: secondMainQualifier.functionaries[0].id,
        details: createCertificateDto.qualifiersResolution,
        role: DEGREE_ATTENDANCE_ROLES.PRINCIPAL,
      })

    attendance.push(secondAttendance)

    // validate first secondary qualifier
    if (createCertificateDto.firstSecondaryQualifierDni) {
      const { data: firstSecondaryQualifier } =
        await this.functionariesService.findByFilters({
          field: createCertificateDto.firstSecondaryQualifierDni,
          state: true,
        })

      if (firstSecondaryQualifier.count === 0) {
        errors.push(
          new DegreeCertificateBadRequestError(
            `No existe el calificador secundario con cédula ${createCertificateDto.firstSecondaryQualifierDni}`,
          ),
        )
      }

      const { data: firstSecondaryAttendance } =
        await this.degreeCertificateAttendanceService.create({
          assignationDate: new Date(),
          degreeCertificateId: degreeCertificate.id,
          functionaryId: firstSecondaryQualifier.functionaries[0].id,
          details: createCertificateDto.qualifiersResolution,
          role: DEGREE_ATTENDANCE_ROLES.SUBSTITUTE,
        })

      attendance.push(firstSecondaryAttendance)
    }

    // validate second secondary qualifier
    if (createCertificateDto.secondSecondaryQualifierDni) {
      const { data: secondSecondaryQualifier } =
        await this.functionariesService.findByFilters({
          field: createCertificateDto.secondSecondaryQualifierDni,
          state: true,
        })

      if (secondSecondaryQualifier.count === 0) {
        errors.push(
          new DegreeCertificateBadRequestError(
            `No existe el calificador secundario con cédula ${createCertificateDto.secondSecondaryQualifierDni}`,
          ),
        )
      }

      const { data: secondSecondaryAttendance } =
        await this.degreeCertificateAttendanceService.create({
          assignationDate: new Date(),
          degreeCertificateId: degreeCertificate.id,
          functionaryId: secondSecondaryQualifier.functionaries[0].id,
          details: createCertificateDto.qualifiersResolution,
          role: DEGREE_ATTENDANCE_ROLES.SUBSTITUTE,
        })

      attendance.push(secondSecondaryAttendance)
    }

    // validate tutor
    const { data: tutor } = await this.functionariesService.findByFilters({
      field: createCertificateDto.mentorDni,
      state: true,
    })

    if (tutor.count === 0) {
      errors.push(
        new DegreeCertificateBadRequestError(
          `No existe el tutor con cédula ${createCertificateDto.mentorDni}`,
        ),
      )
    }

    const { data: tutorAttendance } =
      await this.degreeCertificateAttendanceService.create({
        assignationDate: new Date(),
        degreeCertificateId: degreeCertificate.id,
        functionaryId: tutor.functionaries[0].id,
        details: 'POR DEFINIR',
        role: DEGREE_ATTENDANCE_ROLES.MENTOR,
      })

    attendance.push(tutorAttendance)

    return attendance
  }
}
