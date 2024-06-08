import { Inject, Injectable, Logger } from '@nestjs/common'
import { CreateDegreeCertificateBulkDto } from '../dto/create-degree-certificate-bulk.dto'
import { DegreeCertificatesService } from '../degree-certificates.service'
import { StudentsService } from '../../students/students.service'
import { CertificateTypeService } from './certificate-type.service'
import { FunctionariesService } from '../../functionaries/functionaries.service'
import { CertificateStatusService } from './certificate-status.service'
import { DegreeModalitiesService } from './degree-modalities.service'
import { getSTATUS_CODE_BY_CERT_STATUS } from '../../shared/enums/genders'
import { DegreeCertificateRepository } from '../repositories/degree-certificate-repository'
import { DEGREE_MODALITY } from '../constants'
import { CertificateTypeEntity } from '../entities/certificate-type.entity'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'
import { InjectDataSource } from '@nestjs/typeorm'
import { DegreeCertificateAttendanceService } from '../../degree-certificate-attendance/degree-certificate-attendance.service'
import { DegreeCertificateAttendanceEntity } from '../../degree-certificate-attendance/entities/degree-certificate-attendance.entity'
import { DataSource } from 'typeorm'
import { DEGREE_ATTENDANCE_ROLES } from '../../shared/enums/degree-certificates'
import { CertificateStatusEntity } from '../entities/certificate-status.entity'
import { DegreeModalityEntity } from '../entities/degree-modality.entity'
import { StudentEntity } from '../../students/entities/student.entity'
import { GradesSheetService } from './grades-sheet.service'
import { ErrorsBulkCertificate } from '../errors/errors-bulk-certificate'

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

    private readonly gradesSheetService: GradesSheetService,

    @Inject('DegreeCertificateRepository')
    private readonly degreeCertificateRepository: DegreeCertificateRepository,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createBulkCertificates(
    createCertificatesDtos: CreateDegreeCertificateBulkDto[],
  ): Promise<{ message: string; errors?: ErrorsBulkCertificate[] }[]> {
    const responses: {
      message: string
      errors?: ErrorsBulkCertificate[]
    }[] = []
    // create bulk certificates
    const promises = createCertificatesDtos.map(
      async (createCertificateDto) => {
        const { degreeCertificate, errors } =
          await this.createDegreeCertificate(createCertificateDto)

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
      },
    )

    await Promise.all(promises)

    return responses
  }

  async createDegreeCertificate(
    createCertificateDto: CreateDegreeCertificateBulkDto,
  ): Promise<
    | {
        degreeCertificate: DegreeCertificateEntity
        attendance: DegreeCertificateAttendanceEntity[]
        errors: ErrorsBulkCertificate[]
      }
    | {
        errors: ErrorsBulkCertificate[]
        degreeCertificate?: undefined
        attendance?: undefined
      }
  > {
    const errors: ErrorsBulkCertificate[] = []
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
      createCertificateDto.link !== '' &&
      createCertificateDto.link !== null &&
      createCertificateDto.link !== undefined
        ? DEGREE_MODALITY.ONLINE
        : DEGREE_MODALITY.PRESENCIAL

    // Validate degree modality
    const degreeModalityEntity = await this.validateDegreeModality(
      degreeModality,
      errors,
    )

    if (errors.length > 0) {
      return { errors }
    }
    // start transaction
    const queryRunner = this.dataSource.manager.connection.createQueryRunner()

    await queryRunner.startTransaction()
    try {
      const { degreeCertificate, errors: degreeCertificateErrors } =
        await this.validateCertificate(
          createCertificateDto,
          students.students[0],
          certificateType,
          certificateStatus,
          degreeModalityEntity,
          errors,
        )

      if (degreeCertificateErrors.length > 0) {
        return
      }

      // generate grades sheet
      await this.generateGradesSheet(
        degreeCertificate,
        createCertificateDto.gradesDetails,
        errors,
        createCertificateDto.curriculumGrade,
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
      console.log(error)
      errors.push(
        new ErrorsBulkCertificate(
          'No se pudo crear el certificado de grado',
          error.stack,
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
    errors: ErrorsBulkCertificate[],
  ): Promise<{
    degreeCertificate?: DegreeCertificateEntity
    errors: ErrorsBulkCertificate[]
  }> {
    let degreeCertificate: DegreeCertificateEntity

    degreeCertificate = await this.degreeCertificateRepository.findReplicate({
      topic: createCertificateDto.topic,
      studentId: student.id,
      certificateTypeId: certificateType.id,
      degreeModalityId: degreeModalityEntity.id,
    })

    console.log(degreeCertificate)

    const degreeCertificateData = await this.getDegreeCertificateData({
      createCertificateDto,
      studentId: student.id,
      careerId: student.career.id,
      certificateTypeId: certificateType.id,
      degreeModalityId: degreeModalityEntity.id,
      certificateStatusId: certificateStatus.id,
      userId: createCertificateDto.userId,
      degreeCertificate,
    })

    if (degreeCertificate == null || degreeCertificate === undefined) {
      degreeCertificate = this.degreeCertificateRepository.create(
        degreeCertificateData,
      )

      if (!degreeCertificate) {
        errors.push(
          new ErrorsBulkCertificate(
            'Los datos del certificado son incorrectos',
            new Error().stack,
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
          new ErrorsBulkCertificate(
            'Los datos del certificado son incorrectos',
            new Error().stack,
          ),
        )

        return { errors }
      }
    }

    return { degreeCertificate, errors }
  }

  async validateStudent(studentDni: string, errors: ErrorsBulkCertificate[]) {
    try {
      const { data: students } = await this.studentsService.findByFilters({
        field: studentDni,
        state: true,
      })

      if (students.count === 0) {
        errors.push(
          new ErrorsBulkCertificate(
            `No existe el estudiante con cédula${studentDni}`,
            new Error().stack,
          ),
        )
      }

      return students
    } catch (error) {
      errors.push(
        new ErrorsBulkCertificate(
          `No se pudo obtener el estudiante con cédula ${studentDni}`,
          new Error().stack,
        ),
      )
    }
  }

  async validateCertificateType(
    certificateType: string,
    errors: ErrorsBulkCertificate[],
  ) {
    let certificateTypeEntity: CertificateTypeEntity
    try {
      certificateTypeEntity =
        await this.certiticateTypeService.findCertificateTypeByName(
          certificateType.toUpperCase(),
        )
    } catch (error) {
      errors.push(
        new ErrorsBulkCertificate(
          `No existe el tipo de certificado ${certificateType}`,
          new Error().stack,
        ),
      )
    }

    return certificateTypeEntity
  }

  async validateCertificateStatus(
    certificateStatus: string | undefined,
    errors: ErrorsBulkCertificate[],
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
        new ErrorsBulkCertificate(
          `No existe el estado de certificado ${certificateStatus}`,
          new Error().stack,
        ),
      )
    }

    return certificateStatusEntity
  }

  async validateDegreeModality(
    degreeModality: string,
    errors: ErrorsBulkCertificate[],
  ) {
    let degreeModalityEntity
    try {
      degreeModalityEntity =
        await this.degreeModalitiesService.findDegreeModalityByCode(
          degreeModality,
        )
    } catch (error) {
      errors.push(
        new ErrorsBulkCertificate(
          `No existe la modalidad de grado ${degreeModality}`,
          new Error().stack,
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
    userId,
    degreeCertificate,
  }: {
    createCertificateDto: CreateDegreeCertificateBulkDto
    studentId: number
    careerId: number
    certificateTypeId: number
    degreeModalityId: number
    certificateStatusId: number
    userId: number
    degreeCertificate: DegreeCertificateEntity | undefined
  }) {
    return {
      auxNumber:
        degreeCertificate !== null && degreeCertificate !== undefined
          ? degreeCertificate.auxNumber
          : await this.degreeCertificateService.getLastNumberToRegister(
              careerId,
            ),
      topic: createCertificateDto.topic,
      presentationDate:
        createCertificateDto.presentationDate !== null ||
        createCertificateDto.presentationDate !== undefined
          ? createCertificateDto.presentationDate
          : degreeCertificate !== null || degreeCertificate !== undefined
          ? degreeCertificate.presentationDate
          : null,
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
      user: { id: userId },
    }
  }

  async generateAttendance(
    createCertificateDto: CreateDegreeCertificateBulkDto,
    degreeCertificate: DegreeCertificateEntity,
    errors,
  ): Promise<DegreeCertificateAttendanceEntity[]> {
    const attendance: DegreeCertificateAttendanceEntity[] = []

    try {
      await this.degreeCertificateAttendanceService.removeAllAttendanceByDegreeCertificateId(
        degreeCertificate.id,
      )
    } catch (error) {
      errors.push(
        new ErrorsBulkCertificate(
          'No se pudo actualizar la asistencia al acta de grado',
          new Error().stack,
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
        new ErrorsBulkCertificate(
          `No existe el calificador principal con cédula ${createCertificateDto.firstMainQualifierDni}`,
          new Error().stack,
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
        new ErrorsBulkCertificate(
          `No existe el calificador principal con cédula ${createCertificateDto.secondMainQualifierDni}`,
          new Error().stack,
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
          new ErrorsBulkCertificate(
            `No existe el calificador secundario con cédula ${createCertificateDto.firstSecondaryQualifierDni}`,
            new Error().stack,
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
          new ErrorsBulkCertificate(
            `No existe el calificador secundario con cédula ${createCertificateDto.secondSecondaryQualifierDni}`,
            new Error().stack,
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
        new ErrorsBulkCertificate(
          `No existe el tutor con cédula ${createCertificateDto.mentorDni}`,
          new Error().stack,
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

  async generateGradesSheet(
    degreeCertificate: DegreeCertificateEntity,
    gradesDetails: string,
    errors: ErrorsBulkCertificate[],
    curriculumGrade?: string,
  ): Promise<boolean> {
    if (
      degreeCertificate.gradesSheetDriveId !== null &&
      degreeCertificate.gradesSheetDriveId !== undefined
    ) {
      const revoked = await this.gradesSheetService.revokeGradeSheet(
        degreeCertificate,
      )
      if (!revoked) {
        errors.push(
          new ErrorsBulkCertificate(
            'No se pudo anular la hoja de calificaciones',
            new Error().stack,
          ),
        )
      }
    }

    const foundCertificate = await this.degreeCertificateRepository.findOneFor({
      where: { id: degreeCertificate.id },
    })

    if (!foundCertificate) {
      errors.push(
        new ErrorsBulkCertificate(
          'No se encontró el certificado de grado',
          new Error().stack,
        ),
      )

      return false
    }

    const { data: degreeUpdated } =
      await this.gradesSheetService.generateGradeSheet(foundCertificate)

    if (!degreeUpdated) {
      errors.push(
        new ErrorsBulkCertificate(
          'No se pudo generar la hoja de calificaciones',
          new Error().stack,
        ),
      )

      return false
    }
    try {
      const gradesVariables =
        await this.gradesSheetService.getGradeCellsByCertificateType(
          degreeCertificate.certificateType.id,
        )

      const processedGradesDetails = this.processGradesDetails(
        gradesDetails,
        curriculumGrade,
      )

      const matchedGradesVariables = gradesVariables.filter((cell) =>
        processedGradesDetails.find(
          (grade) => grade.variable === cell.gradeVariable,
        ),
      )

      if (matchedGradesVariables.length !== processedGradesDetails.length) {
        errors.push(
          new ErrorsBulkCertificate(
            `No se encontraron todas las variables de notas en la hoja de calificaciones: variables encontradas: ${matchedGradesVariables.length}, variables esperadas: ${processedGradesDetails.length}, revise las variables de notas en el tipo de acta seleccionado: ${degreeCertificate.certificateType.name}`,
            new Error().stack,
          ),
        )
      }

      const valuesToReplace: [string, string][] = matchedGradesVariables.map(
        (cell) => {
          const grade = processedGradesDetails.find(
            (grade) => grade.variable === cell.gradeVariable,
          )
          return [cell.cell, grade.value]
        },
      )

      try {
        const replacedSheetsId =
          await this.gradesSheetService.replaceCellsVariables({
            cellsVariables: valuesToReplace,
            gradesSheetDriveId: degreeUpdated.gradesSheetDriveId,
          })

        Logger.log(replacedSheetsId, 'replacedSheetsId')

        return true
      } catch (error) {
        errors.push(
          new ErrorsBulkCertificate(
            'No se pudo reemplazar las variables de notas',
            new Error().stack,
          ),
        )
      }
    } catch (error) {
      errors.push(
        new ErrorsBulkCertificate(
          'No se pudo obtener las variables de notas',
          new Error().stack,
        ),
      )
    }
  }

  processGradesDetails(gradesDetails: string, curriculumGrade?: string) {
    // NOTA_1=3.45;NOTA_2=5.65;NOTA_3=10
    const grades = gradesDetails.split(';')
    const gradesData = grades.map((grade) => {
      const [variable, value] = grade.split('=')
      return { variable, value }
    })

    gradesData.push({
      variable: 'NOTAMALLA',
      value: curriculumGrade ? curriculumGrade : '0.0',
    })

    return gradesData
  }
}
