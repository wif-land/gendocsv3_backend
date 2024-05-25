import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateVariableDto } from './dto/create-variable.dto'
import { UpdateVariableDto } from './dto/update-variable.dto'
import { DocumentEntity } from '../documents/entities/document.entity'
import { DefaultVariable } from '../shared/enums/default-variable'
import {
  formatDate,
  formatDateText,
  formatHourMinutesText,
  formatMonthName,
  formatWeekDayName,
} from '../shared/utils/date'
import {
  getFullName,
  formatNumeration,
  concatNames,
} from '../shared/utils/string'
import { DocumentFunctionaryEntity } from '../documents/entities/document-functionary.entity'
import { DataSource, Repository } from 'typeorm'
import { PositionEntity } from '../positions/entities/position.entity'
import { VariableEntity } from './entities/variable.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { DegreeCertificateEntity } from '../degree-certificates/entities/degree-certificate.entity'
import { GENDER } from '../shared/enums/genders'
import {
  DEGREE_ATTENDANCE_ROLES,
  DEGREE_CERTIFICATE_VARIABLES,
  GENDER_DESIGNATION,
  GENDER_DESIGNATION_VARIABLE,
  MEMBERS_DESIGNATION,
  STUDENT_DEGREE_CERTIFICATE,
} from '../shared/enums/degree-certificates'
import { transformNumberToWords } from '../shared/utils/number'
import { StudentEntity } from '../students/entities/student.entity'
import { DegreeCertificateAttendanceEntity } from '../degree-certificate-attendance/entities/degree-certificate-attendance.entity'
import { ADJECTIVES } from '../shared/enums/adjectives'
import { CouncilEntity } from '../councils/entities/council.entity'
import { CouncilAttendanceEntity } from '../councils/entities/council-attendance.entity'

@Injectable()
export class VariablesService {
  constructor(
    @InjectRepository(VariableEntity)
    private readonly variableRepository: Repository<VariableEntity>,
    private dataSource: DataSource,
  ) {}

  async showVariables() {
    const positions = await this.dataSource.manager
      .getRepository(PositionEntity)
      .find({
        relationLoadStrategy: 'join',
        relations: {
          functionary: true,
        },
      })

    const positionsVariables = positions.map((position) => ({
      variable: position.variable,
      example: getFullName(position.functionary),
    }))

    const studentVariables = [
      {
        variable: DefaultVariable.ESTUDIANTE,
        example: 'Juan Pérez',
      },
      {
        variable: DefaultVariable.ESTUDIANTEUP,
        example: 'JUAN PÉREZ',
      },
      {
        variable: DefaultVariable.CEDULA,
        example: '1234567890',
      },
      {
        variable: DefaultVariable.MATRICULA,
        example: '0001',
      },
      {
        variable: DefaultVariable.FOLIO,
        example: '0001',
      },
      {
        variable: DefaultVariable.TELEFONO,
        example: '032382323',
      },
      {
        variable: DefaultVariable.CELULAR,
        example: '0999988888',
      },
      {
        variable: DefaultVariable.CORREO,
        example: 'estudiante@gmail.com',
      },
      {
        variable: DefaultVariable.CORREOUTA,
        example: 'estudiante@uta.edu.ec',
      },
      {
        variable: DefaultVariable.NOMBRECARRERA,
        example: 'Ingeniería en Sistemas',
      },
      {
        variable: DefaultVariable.NOMBRECARRERAUP,
        example: 'INGENIERÍA EN SISTEMAS',
      },
      {
        variable: DefaultVariable.ESTUDIANTE_TITULO,
        example: 'Ingeniero en Sistemas',
      },
      {
        variable: DefaultVariable.ESTUDIANTE_FECHA_NACIMIENTO,
        example: '16 de julio de 1990',
      },
      {
        variable: DefaultVariable.ESTUDIANTE_TITULO_UPPER,
        example: 'INGENIERO EN SISTEMAS',
      },
      {
        variable: DefaultVariable.ESTUDIANTE_TEMA,
        example: 'Tesis de analisis',
      },
      {
        variable: DefaultVariable.ESTUDIANTE_TITULO_BACHILLER,
        example: 'Bachiller en Ciencias',
      },
      {
        variable: DefaultVariable.ESTUDIANTE_FECHA_INICIO_ESTUDIOS_FECHAUP,
        example: '16 de julio de 2010',
      },
      {
        variable: DefaultVariable.ESTUDIANTE_FECHA_FIN_ESTUDIOS_FECHAUP,
        example: '16 de julio de 2015',
      },
      {
        variable: DefaultVariable.COORDINADOR,
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DefaultVariable.CANTON,
        example: 'Ambato',
      },
      {
        variable: DefaultVariable.PROVINCE,
        example: 'Tungurahua',
      },
    ]

    const functionariesVariables = [
      {
        variable: DefaultVariable.DOCENTE_N.replace('$i', '1'),
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DefaultVariable.DOCENTE_N.replace('$i', '2'),
        example: 'Ing. Juan Pérez',
      },
    ]
    const councilVariables = [
      {
        variable: DefaultVariable.FECHA,
        example: '16 de julio de 2021',
      },
      {
        variable: DefaultVariable.RESPONSABLE,
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DefaultVariable.NUMACT,
        example: '001',
      },
      {
        variable: DefaultVariable.FECHAUP,
        example: '16 DE JULIO DE 2021',
      },
      {
        variable: DefaultVariable.SESIONUP,
        example: 'ORDINARIA',
      },
      {
        variable: DefaultVariable.SESION,
        example: 'ordinaria',
      },
      {
        variable: DefaultVariable.Y,
        example: '2022',
      },
      {
        variable: DefaultVariable.DIASEM_T,
        example: 'viernes',
      },
      {
        variable: DefaultVariable.NUMMES_T_U,
        example: 'JULIO',
      },
      {
        variable: DefaultVariable.MES_T_L,
        example: 'julio',
      },
      {
        variable: DefaultVariable.NUMDIA_T,
        example: 'dieciséis',
      },
      {
        variable: DefaultVariable.NUMANIO_T,
        example: 'dos mil veintiuno',
      },
      {
        variable: DefaultVariable.NUMANIO_T_L,
        example: 'dos mil veintiuno',
      },
      {
        variable: DefaultVariable.DIAS_T,
        example: 'dieciséis días',
      },
      {
        variable: DefaultVariable.HORA_T_L,
        example: 'dieciséis',
      },
      {
        variable: DefaultVariable.MINUTOS_T_L,
        example: 'dieciséis',
      },
      {
        variable: DefaultVariable.ASISTIERON,
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DefaultVariable.NO_ASISTIERON,
        example: 'Ing. Juan Pérez',
      },
    ]
    const documentVariables = [
      {
        variable: DefaultVariable.CREADOPOR,
        example: 'Usuario admin',
      },
      {
        variable: DefaultVariable.NUMDOC,
        example: '001',
      },
      {
        variable: DefaultVariable.YEAR,
        example: '2022',
      },
    ]
    const degreeCertificateVariables = [
      {
        variable: GENDER_DESIGNATION_VARIABLE(1),
        example: 'el señor',
      },
      {
        variable:
          MEMBERS_DESIGNATION[DEGREE_ATTENDANCE_ROLES.PRINCIPAL][
            ADJECTIVES.PLURAL
          ],
        example: 'designados mediante',
      },
      {
        variable:
          MEMBERS_DESIGNATION[DEGREE_ATTENDANCE_ROLES.PRINCIPAL][
            ADJECTIVES.SINGULAR
          ],
        example: 'designado mediante',
      },
      {
        variable:
          MEMBERS_DESIGNATION[DEGREE_ATTENDANCE_ROLES.SUBSTITUTE][
            ADJECTIVES.PLURAL
          ],
        example: 'principalizados mediante',
      },
      {
        variable:
          MEMBERS_DESIGNATION[DEGREE_ATTENDANCE_ROLES.SUBSTITUTE][
            ADJECTIVES.SINGULAR
          ],
        example: 'principalizado mediante',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.DEGREE_CERTIFICATE_PRESIDENT,
        example: 'Ing. Juan Pérez',
      },
      {
        variable:
          DEGREE_CERTIFICATE_VARIABLES.DEGREE_CERTIFICATE_PRESIDENT_DOC_ASSIGNED,
        example: 'Presidente',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.MEMBERS_DEGREE_CERTIFICATE,
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.FIRST_MEMBER_DEGREE_CERTIFICATE,
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.SECOND_MEMBER_DEGREE_CERTIFICATE,
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.CREATED_BY,
        example: 'Usuario admin',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.DECANA,
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.IC_UNIT_PRESIDENT,
        example: 'Ing. Juan Pérez',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.DEGREE_CERTIFICATE_TYPE,
        example: 'ACTA DE GRADO',
      },
      {
        variable: DEGREE_CERTIFICATE_VARIABLES.DEGREE_CERTIFICATE_TOPIC,
        example: 'Tesis de analisis',
      },
      {
        variable: STUDENT_DEGREE_CERTIFICATE.CREDITS_TEXT,
        example: 'cien',
      },
      {
        variable: STUDENT_DEGREE_CERTIFICATE.CREDITS_NUMBER,
        example: '100',
      },
      {
        variable: STUDENT_DEGREE_CERTIFICATE.INTERNSHIP_HOURS,
        example: '100',
      },
      {
        variable: STUDENT_DEGREE_CERTIFICATE.VINCULATION_HOURS,
        example: '100',
      },
      {
        variable: STUDENT_DEGREE_CERTIFICATE.VINCULATION_HOURS_TEXT,
        example: 'cien',
      },
      {
        variable: STUDENT_DEGREE_CERTIFICATE.INTERNSHIP_HOURS_TEXT,
        example: 'cien',
      },
      {
        variable: STUDENT_DEGREE_CERTIFICATE.DEGREE_CERTIFICATE_STATUS,
        example: 'GRADUADO',
      },
    ]

    return new ApiResponseDto('Variables encontradas con éxito', {
      Posiciones: positionsVariables,
      Estudiantes: studentVariables,
      Funcionarios: functionariesVariables,
      Consejos: councilVariables,
      Documentos: documentVariables,
      Actas_de_grado: degreeCertificateVariables,
    })
  }

  async create(createVariableDto: CreateVariableDto) {
    try {
      const alreadyExists = await this.variableRepository.findOne({
        where: { variable: createVariableDto.variable },
      })

      if (alreadyExists) {
        throw new BadRequestException('Variable already exists')
      }

      const variable = this.variableRepository.create(createVariableDto)

      if (!variable) {
        throw new BadRequestException('Variable not created')
      }

      const newVariable = await this.variableRepository.save(variable)

      return new ApiResponseDto('Variable creada con éxito', newVariable)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      const variables = await this.variableRepository.find()

      return new ApiResponseDto('Variables encontradas con éxito', variables)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const variable = await this.variableRepository.findOne({ where: { id } })

      if (!variable) {
        throw new BadRequestException('Variable not found')
      }

      return new ApiResponseDto('Variable encontrada con éxito', variable)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(id: number, updateVariableDto: UpdateVariableDto) {
    try {
      const alreadyExists = await this.variableRepository.findOne({
        where: { variable: updateVariableDto.variable },
      })

      if (alreadyExists) {
        throw new BadRequestException('Variable already exists')
      }

      const variable = await this.variableRepository.save({
        id,
        ...updateVariableDto,
      })

      return new ApiResponseDto('Variable actualizada con éxito', variable)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      await this.variableRepository.delete(id)

      return new ApiResponseDto('Variable eliminada con éxito', {
        success: true,
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getGeneralVariables(
    document: DocumentEntity | DegreeCertificateEntity,
  ) {
    try {
      const variables = {
        [DefaultVariable.CREADOPOR]: `${document.user.firstName} ${document.user.firstLastName}`,
        [DefaultVariable.NUMDOC]: formatNumeration(
          document instanceof DocumentEntity
            ? document.numerationDocument.number
            : (document as DegreeCertificateEntity).number,
        ),
        [DefaultVariable.YEAR]: document.createdAt.getFullYear().toString(),
      }

      return new ApiResponseDto(
        'Variables generales encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCouncilVariables(document: DocumentEntity) {
    try {
      const functionary = document.numerationDocument.council.attendance.find(
        (attendance) => attendance.positionOrder === 1,
      ).functionary

      if (!functionary) {
        throw new BadRequestException('El consejo no tiene presidente asignado')
      }

      const variables = {
        [DefaultVariable.FECHA]: formatDate(
          document.numerationDocument.council.date,
        ),
        [DefaultVariable.FECHAUP]: formatDateText(
          document.numerationDocument.council.date,
        ),
        [DefaultVariable.SESION]:
          document.numerationDocument.council.type.toLowerCase(),
        [DefaultVariable.SESIONUP]:
          document.numerationDocument.council.type.toUpperCase(),
        [DefaultVariable.RESPONSABLE]: `${getFullName(functionary)}`,
      }

      return new ApiResponseDto(
        'Variables de consejo encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  getGenderDesingationVariables(student: StudentEntity) {
    const genderVariations = {}

    GENDER_DESIGNATION.map(
      (genderDesignation, index) =>
        // eslint-disable-next-line no-extra-parens
        (genderVariations[GENDER_DESIGNATION_VARIABLE(index)] =
          genderDesignation[student.gender]),
    )

    return genderVariations
  }

  getStudentDegreeCertificateVariables(document: DegreeCertificateEntity) {
    const degree =
      document.student.gender === GENDER.FEMALE
        ? document.student.career.womenDegree
        : document.student.career.menDegree

    const fullName = getFullName(document.student)

    const career = document.student.career.name

    const genderVariations = this.getGenderDesingationVariables(
      document.student,
    )

    const variables = {
      ...genderVariations,
      [DefaultVariable.ESTUDIANTE]: fullName,
      [DefaultVariable.ESTUDIANTEUP]: fullName.toUpperCase(),
      [DefaultVariable.CEDULA]: document.student.dni,
      [DefaultVariable.MATRICULA]: document.student.registration,
      [DefaultVariable.FOLIO]: document.student.folio,
      [DefaultVariable.TELEFONO]: document.student.regularPhoneNumber,
      [DefaultVariable.CELULAR]: document.student.phoneNumber,
      [DefaultVariable.CORREO]: document.student.personalEmail,
      [DefaultVariable.CORREOUTA]: document.student.outlookEmail,
      [DefaultVariable.NOMBRECARRERA]: career,
      [DefaultVariable.NOMBRECARRERAUP]: career.toUpperCase(),
      [DefaultVariable.ESTUDIANTE_TITULO]: degree,
      [DefaultVariable.ESTUDIANTE_FECHA_NACIMIENTO]: formatDateText(
        document.student.birthdate,
      ),
      [DefaultVariable.ESTUDIANTE_TITULO_UPPER]: degree.toUpperCase(),
      [DefaultVariable.ESTUDIANTE_TEMA]:
        (document as DegreeCertificateEntity).topic ?? '*NO POSEE TEMA',
      [DefaultVariable.ESTUDIANTE_TITULO_BACHILLER]:
        document.student.bachelorDegree ?? '*NO POSEE TÍTULO BACHILLER',
      [DefaultVariable.ESTUDIANTE_FECHA_INICIO_ESTUDIOS_FECHAUP]: document
        .student.startStudiesDate
        ? formatDateText(document.student.startStudiesDate)
        : '*NO POSEE FECHA DE INICIO DE ESTUDIOS',
      [DefaultVariable.ESTUDIANTE_FECHA_FIN_ESTUDIOS_FECHAUP]: document.student
        .startStudiesDate
        ? formatDateText(document.student.endStudiesDate)
        : '*NO POSEE FECHA DE FIN DE ESTUDIOS',

      [DefaultVariable.COORDINADOR]: getFullName(document.career.coordinator),
      [DefaultVariable.CANTON]: document.student.canton.name,
      [DefaultVariable.PROVINCE]: document.student.canton.province.name,
      [STUDENT_DEGREE_CERTIFICATE.CREDITS_TEXT]: transformNumberToWords(
        document.student.approvedCredits,
      ).toLowerCase(),
      [STUDENT_DEGREE_CERTIFICATE.CREDITS_NUMBER]:
        document.student.approvedCredits.toString(),
      [STUDENT_DEGREE_CERTIFICATE.INTERNSHIP_HOURS]:
        document.student.internshipHours.toString(),
      [STUDENT_DEGREE_CERTIFICATE.INTERNSHIP_HOURS_TEXT]:
        transformNumberToWords(document.student.internshipHours).toLowerCase(),
      [STUDENT_DEGREE_CERTIFICATE.VINCULATION_HOURS]:
        document.student.vinculationHours.toString(),
      [STUDENT_DEGREE_CERTIFICATE.VINCULATION_HOURS_TEXT]:
        transformNumberToWords(document.student.vinculationHours).toLowerCase(),
      [STUDENT_DEGREE_CERTIFICATE.DEGREE_CERTIFICATE_STATUS]:
        document.student.gender === GENDER.FEMALE
          ? (
              document as DegreeCertificateEntity
            ).certificateStatus.femaleName.toUpperCase()
          : (
              document as DegreeCertificateEntity
            ).certificateStatus.maleName.toUpperCase(),
    }

    return new ApiResponseDto(
      'Variables de estudiante encontradas con éxito',
      variables,
    )
  }

  getStudentVariables(document: DocumentEntity) {
    const variables = {
      [DefaultVariable.ESTUDIANTE]: getFullName(document.student),
      [DefaultVariable.ESTUDIANTEUP]: getFullName(
        document.student,
      ).toUpperCase(),
      [DefaultVariable.CEDULA]: document.student.dni,
      [DefaultVariable.MATRICULA]: document.student.registration,
      [DefaultVariable.FOLIO]: document.student.folio,
      [DefaultVariable.TELEFONO]: document.student.regularPhoneNumber,
      [DefaultVariable.CELULAR]: document.student.phoneNumber,
      [DefaultVariable.CORREO]: document.student.personalEmail,
      [DefaultVariable.CORREOUTA]: document.student.outlookEmail,
      [DefaultVariable.NOMBRECARRERA]: document.student.career.name,
      [DefaultVariable.NOMBRECARRERAUP]:
        document.student.career.name.toUpperCase(),
      [DefaultVariable.ESTUDIANTE_TITULO]:
        document.student.gender === GENDER.FEMALE
          ? document.student.career.womenDegree
          : document.student.career.menDegree,
      [DefaultVariable.ESTUDIANTE_FECHA_NACIMIENTO]: formatDateText(
        document.student.birthdate,
      ),
      [DefaultVariable.ESTUDIANTE_TITULO_UPPER]: (document.student.gender ===
      GENDER.FEMALE
        ? document.student.career.womenDegree
        : document.student.career.menDegree
      ).toUpperCase(),
      [DefaultVariable.COORDINADOR]: getFullName(
        document.student.career.coordinator,
      ),
      [DefaultVariable.CANTON]: document.student.canton.name,
      [DefaultVariable.PROVINCE]: document.student.canton.province.name,
    }

    return new ApiResponseDto(
      'Variables de estudiante encontradas con éxito',
      variables,
    )
  }

  async getFunctionaryVariables(
    documentFunctionaries: DocumentFunctionaryEntity[],
  ) {
    try {
      const variables = {}
      documentFunctionaries.forEach(
        (documentFunctionary, index) =>
          // eslint-disable-next-line no-extra-parens
          (variables[
            DefaultVariable.DOCENTE_N.replace('$i', (index + 1).toString())
          ] = getFullName(documentFunctionary.functionary)),
      )

      return new ApiResponseDto(
        'Variables de docentes encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  formatMembersNames(
    members: DegreeCertificateAttendanceEntity[] | CouncilAttendanceEntity[],
  ) {
    if (members.length === 1) {
      return getFullName(members[0].functionary)
    }

    return concatNames(members.map((member) => getFullName(member.functionary)))
  }

  formatMembersDateText(members: DegreeCertificateAttendanceEntity[]) {
    const isDetailsDifferent = members.some(
      (member) => member.details !== members[0].details,
    )

    if (!isDetailsDifferent) {
      return `${this.formatMembersNames(members)} ${
        members.length === 1
          ? MEMBERS_DESIGNATION[members[0].role][ADJECTIVES.SINGULAR]
          : MEMBERS_DESIGNATION[members[0].role][ADJECTIVES.PLURAL]
      } ${members[0].details} de fecha ${formatDateText(
        members[-1].assignationDate,
      )}`
    }

    const clasifiedByDetails = members.reduce((acc, member) => {
      if (!acc[member.details]) {
        acc[member.details] = []
      }

      acc[member.details].push(member)

      return acc
    })

    const membersText = Object.entries(clasifiedByDetails).map(
      ([details, members]) =>
        `${this.formatMembersNames(members)} ${
          members.length === 1
            ? MEMBERS_DESIGNATION[members[0].role][ADJECTIVES.SINGULAR]
            : MEMBERS_DESIGNATION[members[0].role][ADJECTIVES.PLURAL]
        } ${details} de fecha ${formatDateText(members[-1].assignationDate)}`,
    )

    return membersText.join(' ')
  }

  async getDegreeCertificateMemberVariables(
    members: DegreeCertificateAttendanceEntity[],
  ) {
    const membersHasntAttended = members.filter((member) => !member.hasAttended)

    const membersAttended = members.filter((member) => member.hasAttended)

    const presidentData = {}

    const president = membersAttended.find(
      (member) => member.role === DEGREE_ATTENDANCE_ROLES.PRESIDENT,
    )

    if (president) {
      presidentData[DEGREE_CERTIFICATE_VARIABLES.DEGREE_CERTIFICATE_PRESIDENT] =
        getFullName(president.functionary)
      presidentData[
        DEGREE_CERTIFICATE_VARIABLES.DEGREE_CERTIFICATE_PRESIDENT_DOC_ASSIGNED
      ] = president.details
    }

    const membersData = {}

    const tribunalMembers = membersAttended.filter(
      (member) =>
        member.role === DEGREE_ATTENDANCE_ROLES.PRINCIPAL ||
        // eslint-disable-next-line no-extra-parens
        member.role === DEGREE_ATTENDANCE_ROLES.SUBSTITUTE,
    )

    if (tribunalMembers.length) {
      membersData[DEGREE_CERTIFICATE_VARIABLES.MEMBERS_DEGREE_CERTIFICATE] =
        this.formatMembersNames(tribunalMembers)
      membersData[
        DEGREE_CERTIFICATE_VARIABLES.FIRST_MEMBER_DEGREE_CERTIFICATE
      ] = getFullName(tribunalMembers[0].functionary)
      membersData[
        DEGREE_CERTIFICATE_VARIABLES.SECOND_MEMBER_DEGREE_CERTIFICATE
      ] = getFullName(tribunalMembers[-1].functionary)
      membersData[DefaultVariable.ASISTIERON] =
        this.formatMembersNames(membersAttended)
      membersData[DefaultVariable.NO_ASISTIERON] =
        this.formatMembersNames(membersHasntAttended)
    }

    const qb = this.dataSource
      .createQueryBuilder(PositionEntity, 'position')
      .leftJoinAndSelect('position.functionary', 'functionary')
      .where('position.variable = :variable', {
        variable: DEGREE_CERTIFICATE_VARIABLES.DECANA,
      })
      .orWhere('position.variable = :variable', {
        variable: DEGREE_CERTIFICATE_VARIABLES.IC_UNIT_PRESIDENT,
      })

    const positions = await qb.getMany()

    const decana = positions.find(
      (position) => position.variable === DEGREE_CERTIFICATE_VARIABLES.DECANA,
    )

    if (decana) {
      membersData[DEGREE_CERTIFICATE_VARIABLES.DECANA] = getFullName(
        decana.functionary,
      )
    }

    const icUnitPresident = positions.find(
      (position) =>
        position.variable === DEGREE_CERTIFICATE_VARIABLES.IC_UNIT_PRESIDENT,
    )

    if (icUnitPresident) {
      membersData[DEGREE_CERTIFICATE_VARIABLES.IC_UNIT_PRESIDENT] = getFullName(
        icUnitPresident.functionary,
      )
    }

    return { ...presidentData, ...membersData }
  }

  getDegreeCertificateTitulationVariables(
    degreeCertificate: DegreeCertificateEntity,
    presentationDate: Date,
  ) {
    const year = presentationDate.getFullYear().toString()
    const monthText = formatMonthName(presentationDate)
    const dayText = transformNumberToWords(presentationDate.getDate())

    return {
      [DEGREE_CERTIFICATE_VARIABLES.DEGREE_CERTIFICATE_TYPE]:
        degreeCertificate.certificateType.name.toUpperCase(),
      [DEGREE_CERTIFICATE_VARIABLES.DEGREE_CERTIFICATE_TOPIC]:
        degreeCertificate.topic.toUpperCase(),
      // eslint-disable-next-line no-magic-numbers
      [DefaultVariable.NUMDOC]: formatNumeration(degreeCertificate.number, 3),
      [DefaultVariable.Y]: year,
      [DefaultVariable.YEAR]: year,
      [DefaultVariable.FECHA]: formatDateText(presentationDate),
      [DefaultVariable.FECHAUP]: formatDateText(presentationDate).toUpperCase(),
      [DefaultVariable.DIASEM_T]: formatWeekDayName(presentationDate),
      [DefaultVariable.NUMMES_T_U]: monthText.toUpperCase(),
      [DefaultVariable.MES_T_L]: monthText.toLowerCase(),
      [DefaultVariable.DIAS_T]: `${dayText} días`,
      [DefaultVariable.NUMDIA_T]: dayText.toUpperCase(),
      [DefaultVariable.NUMANIO_T]: transformNumberToWords(
        presentationDate.getFullYear(),
      ).toUpperCase(),
      [DefaultVariable.NUMANIO_T_L]: transformNumberToWords(
        presentationDate.getFullYear(),
      ).toLowerCase(),
      [DefaultVariable.HORA_T_L]: transformNumberToWords(
        presentationDate.getHours(),
      ).toLowerCase(),
      [DefaultVariable.MINUTOS_T_L]: transformNumberToWords(
        presentationDate.getMinutes(),
      ).toLowerCase(),
      [DefaultVariable.HORA_MINUTOS_TEXTO_L]:
        formatHourMinutesText(presentationDate),
    }
  }

  async getDegreeCertificateVariables(
    degreeCertificate: DegreeCertificateEntity,
    degreeCertificateAttendance: DegreeCertificateAttendanceEntity[],
  ) {
    // set timezone GMT-5
    // const presentationDate = moment(degreeCertificate.presentationDate)
    //   .tz('America/Bogota')
    //   .toDate()

    const presentationDate = new Date(
      degreeCertificate.presentationDate.toString(),
    )
    const { data: studentData } =
      this.getStudentDegreeCertificateVariables(degreeCertificate)

    const memberData = this.getDegreeCertificateMemberVariables(
      degreeCertificateAttendance,
    )

    const titulationData = this.getDegreeCertificateTitulationVariables(
      degreeCertificate,
      presentationDate,
    )

    const { data: positionsVariables } = await this.getPositionVariables()

    return new ApiResponseDto('Variables de acta generadas éxito', {
      ...studentData,
      ...memberData,
      ...titulationData,
      ...positionsVariables,
    })
  }

  async getRecopilationVariables(numdoc: number, council: CouncilEntity) {
    try {
      const variables = {
        [DefaultVariable.FECHA]: formatDate(council.date),
        [DefaultVariable.RESPONSABLE]: getFullName(
          council.attendance.find(
            (attendance) => attendance.positionOrder === 1,
          ).functionary,
        ),
        [DefaultVariable.NUMACT]: formatNumeration(numdoc),
        [DefaultVariable.FECHAUP]: formatDateText(council.date),
        [DefaultVariable.SESIONUP]: council.type.toUpperCase(),
        [DefaultVariable.SESION]: council.type.toLowerCase(),
        [DefaultVariable.Y]: council.date.getFullYear().toString(),
        [DefaultVariable.DIASEM_T]: formatWeekDayName(council.date),
        [DefaultVariable.NUMMES_T_U]: formatMonthName(
          council.date,
        ).toUpperCase(),
        [DefaultVariable.MES_T_L]: formatMonthName(council.date).toLowerCase(),
        [DefaultVariable.NUMDIA_T]: transformNumberToWords(
          council.date.getDate(),
        ),
        [DefaultVariable.NUMANIO_T]: transformNumberToWords(
          council.date.getFullYear(),
        ),
        [DefaultVariable.NUMANIO_T_L]: transformNumberToWords(
          council.date.getFullYear(),
        ).toLowerCase(),
        [DefaultVariable.DIAS_T]: `${transformNumberToWords(
          council.date.getDate(),
        )} días`,
        [DefaultVariable.HORA_T_L]: transformNumberToWords(
          council.date.getHours(),
        ),
        [DefaultVariable.MINUTOS_T_L]: transformNumberToWords(
          council.date.getMinutes(),
        ).toLowerCase(),
        [DefaultVariable.ASISTIERON]: this.formatMembersNames(
          council.attendance.filter((attendance) => attendance.hasAttended),
        ),
        [DefaultVariable.NO_ASISTIERON]: this.formatMembersNames(
          council.attendance.filter((attendance) => !attendance.hasAttended),
        ),
      }
      const { data: positionsVariables } = await this.getPositionVariables()

      return new ApiResponseDto(
        'Variables de recopilación encontradas con éxito',
        {
          ...variables,
          ...positionsVariables,
        },
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getPositionVariables() {
    try {
      const variables = {}

      const qb = this.dataSource
        .createQueryBuilder(PositionEntity, 'position')
        .leftJoinAndSelect('position.functionary', 'functionary')

      const positions = await qb.getMany()

      positions.forEach(
        (position) =>
          // eslint-disable-next-line no-extra-parens
          (variables[position.variable] = getFullName(position.functionary)),
      )

      return new ApiResponseDto(
        'Variables de posiciones encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCustomVariables() {
    try {
      const variables: { [DefaultVariable: string]: string } = {}

      const { data: customVariables } = await this.findAll()

      customVariables.forEach(
        (customVariable) =>
          // eslint-disable-next-line no-extra-parens
          (variables[customVariable.variable] = customVariable.value),
      )

      return new ApiResponseDto(
        'Variables personalizadas encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
