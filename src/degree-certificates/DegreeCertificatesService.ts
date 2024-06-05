import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull, Not } from 'typeorm'
import { DegreeCertificateAttendanceService } from '../degree-certificate-attendance/degree-certificate-attendance.service'
import { FilesService } from '../files/services/files.service'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import {
  DEGREE_MODULES,
  DEGREE_CERTIFICATE_GRADES,
} from '../shared/enums/degree-certificates'
import { transformNumberToWords } from '../shared/utils/number'
import { StudentEntity } from '../students/entities/student.entity'
import { StudentsService } from '../students/students.service'
import { VariablesService } from '../variables/variables.service'
import { YearModuleService } from '../year-module/year-module.service'
import { CreateCellGradeDegreeCertificateTypeDto } from './dto/create-cells-grade-degree-certificate-type.dto'
import { CreateDegreeCertificateDto } from './dto/create-degree-certificate.dto'
import { UpdateCellGradeDegreeCertificateTypeDto } from './dto/update-cells-grade-degree-certificate-type.dto'
import { UpdateDegreeCertificateDto } from './dto/update-degree-certificate.dto'
import { CellsGradeDegreeCertificateTypeEntity } from './entities/cells-grade-degree-certificate-type.entity'
import { CertificateTypeCareerEntity } from './entities/certicate-type-career.entity'
import { CertificateStatusEntity } from './entities/certificate-status.entity'
import { CertificateTypeStatusEntity } from './entities/certificate-type-status.entity'
import { CertificateTypeEntity } from './entities/certificate-type.entity'
import { DegreeCertificateEntity } from './entities/degree-certificate.entity'
import { DegreeModalityEntity } from './entities/degree-modality.entity'
import { RoomEntity } from './entities/room.entity'
import { DegreeCertificateAlreadyExists } from './errors/degree-certificate-already-exists'
import { DegreeCertificateBadRequestError } from './errors/degree-certificate-bad-request'
import { DegreeCertificateConflict } from './errors/degree-certificate-conflict'
import { DegreeCertificateNotFoundError } from './errors/degree-certificate-not-found'
import { DegreeCertificateTypeNotFoundError } from './errors/degree-certificate-type-not-found'

@Injectable()
export class DegreeCertificatesService {
  constructor(
    private readonly yearModuleService: YearModuleService,
    private readonly filesService: FilesService,
    private readonly studentService: StudentsService,
    private readonly variablesService: VariablesService,
    private readonly degreeCertificateAttendanceService: DegreeCertificateAttendanceService,

    @InjectRepository(DegreeCertificateEntity)
    private readonly degreeCertificateRepository: Repository<DegreeCertificateEntity>,

    @InjectRepository(CertificateStatusEntity)
    private readonly certificateStatusRepository: Repository<CertificateStatusEntity>,

    @InjectRepository(CertificateTypeEntity)
    private readonly certificateTypeRepository: Repository<CertificateTypeEntity>,

    @InjectRepository(DegreeModalityEntity)
    private readonly degreeModalityRepository: Repository<DegreeModalityEntity>,

    @InjectRepository(CertificateTypeStatusEntity)
    private readonly certificateTypeStatusRepository: Repository<CertificateTypeStatusEntity>,

    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,

    @InjectRepository(CertificateTypeCareerEntity)
    private readonly cetificateTypeCareerRepository: Repository<CertificateTypeCareerEntity>,

    @InjectRepository(CellsGradeDegreeCertificateTypeEntity)
    private readonly cellsGradeDegreeCertificateTypeRepository: Repository<CellsGradeDegreeCertificateTypeEntity>,
  ) {}

  async getCertificateTypesCarrerByCarrer(carrerId: number) {
    const certificateTypes = await this.cetificateTypeCareerRepository.find({
      where: {
        career: { id: carrerId },
      },
      relationLoadStrategy: 'join',
      relations: {
        certificateType: true,
      },
    })

    if (!certificateTypes || certificateTypes.length === 0) {
      return new DegreeCertificateTypeNotFoundError(
        `No se han encontrado modalidades de grado para la carrera con id ${carrerId}`,
      )
    }

    return certificateTypes
  }

  async getCertificateStatusByType(certificateTypeId: number) {
    const certificateStatus = await this.certificateTypeStatusRepository.findBy(
      {
        certificateType: { id: certificateTypeId },
      },
    )

    if (!certificateStatus || certificateStatus.length === 0) {
      return new DegreeCertificateNotFoundError(
        `No se han encontrado estados de certificado para el tipo de certificado con id ${certificateTypeId}`,
      )
    }

    return certificateStatus
  }

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

    const degreeCertificates = await this.degreeCertificateRepository.find({
      relationLoadStrategy: 'join',
      relations: {
        student: {
          canton: true,
        },
        career: true,
        certificateType: true,
        certificateStatus: true,
        degreeModality: true,
        room: true,
      },
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

  async findReplicate(CreateCertificateDegreeDto: CreateDegreeCertificateDto) {
    const submoduleYearModule = await this.getCurrentDegreeSubmoduleYearModule()

    const degreeCertificate = await this.degreeCertificateRepository.findOneBy({
      deletedAt: null,
      presentationDate: CreateCertificateDegreeDto.presentationDate,
      student: { id: CreateCertificateDegreeDto.studentId },
      isClosed: false,
      certificateType: { id: CreateCertificateDegreeDto.certificateTypeId },
      certificateStatus: {
        id: CreateCertificateDegreeDto.certificateStatusId,
      },
      degreeModality: { id: CreateCertificateDegreeDto.degreeModalityId },
      room: { id: CreateCertificateDegreeDto.roomId },
      submoduleYearModule: {
        id: submoduleYearModule.id,
      },
    })

    if (!degreeCertificate || degreeCertificate == null) {
      return undefined
    }

    return degreeCertificate
  }

  async generateGradeSheet(degreeCertificate: DegreeCertificateEntity) {
    const gradeSheet = await this.filesService.createDocumentByParentIdAndCopy(
      `GR ${degreeCertificate.student.dni} | ${degreeCertificate.certificateType.code} - ${degreeCertificate.certificateStatus.code}`,
      degreeCertificate.submoduleYearModule.driveId,
      degreeCertificate.certificateType.driveId,
    )

    if (!gradeSheet) {
      throw new DegreeCertificateBadRequestError(
        'Error al generar la hoja de calificaciones en Google Drive',
      )
    }

    const degreeCertificateUpdated =
      await this.degreeCertificateRepository.save({
        ...degreeCertificate,
        gradesSheetDriveId: gradeSheet.data,
      })

    return new ApiResponseDto(
      'Hoja de calificaciones generada correctamente',
      degreeCertificateUpdated,
    )
  }

  async revokeGradeSheet(degreeCertificate: DegreeCertificateEntity) {
    const { data: driveId } = await this.filesService.renameAsset(
      degreeCertificate.gradesSheetDriveId,
      `(ANULADA) GR ${degreeCertificate.student.dni} | ${degreeCertificate.certificateType.code} - ${degreeCertificate.certificateStatus.code}`,
    )

    if (!driveId) {
      return false
    }

    return true
  }

  async create(dto: CreateDegreeCertificateDto) {
    if (await this.findReplicate(dto)) {
      throw new DegreeCertificateAlreadyExists(
        'Ya existe un certificado con los mismos datos',
      )
    }

    const student: StudentEntity = (
      await this.studentService.findOne(dto.studentId)
    ).data

    if (
      student.gender == null ||
      student.endStudiesDate == null ||
      student.startStudiesDate == null ||
      student.internshipHours == null ||
      student.vinculationHours == null
    ) {
      throw new DegreeCertificateBadRequestError(
        'El estudiante no cuenta con la información necesaria para generar la acta de grado',
      )
    }

    const certificateStatusType = await this.findCertificateStatusType(
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
      room: { id: dto.roomId },
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
      await this.degreeCertificateRepository.findOne({
        where: { id: newCertificate.id },
        relationLoadStrategy: 'join',
        relations: {
          student: {
            canton: true,
          },
          career: true,
          certificateType: true,
          certificateStatus: true,
          degreeModality: true,
          room: true,
          submoduleYearModule: true,
        },
      })

    const { data: createdDegreeCertificate } = await this.generateGradeSheet(
      relationshipCertificate,
    )

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

  async findCertificateStatusType(
    certificateTypeId: number,
    certificateStatusId: number,
  ) {
    const certificateTypeStatus =
      await this.certificateTypeStatusRepository.findOneBy({
        certificateType: { id: certificateTypeId },
        certificateStatus: { id: certificateStatusId },
      })

    if (!certificateTypeStatus) {
      throw new DegreeCertificateNotFoundError(
        'No se encontró el estado de certificado para el tipo de certificado',
      )
    }

    return certificateTypeStatus
  }

  async getGradeCellsByCertificateType(certificateTypeId: number) {
    const cells = await this.cellsGradeDegreeCertificateTypeRepository.findBy({
      certificateType: { id: certificateTypeId },
    })

    if (!cells || cells.length === 0) {
      throw new DegreeCertificateNotFoundError(
        'No se encontraron celdas de calificación para el tipo de certificado',
      )
    }

    return cells
  }

  async createCellGradeByCertificateType(
    createCellGradeDegreeCertificateTypeDto: CreateCellGradeDegreeCertificateTypeDto,
  ) {
    const cellAlreadyExists =
      await this.cellsGradeDegreeCertificateTypeRepository.findOneBy({
        certificateType: {
          id: createCellGradeDegreeCertificateTypeDto.certificateTypeId,
        },
        cell: createCellGradeDegreeCertificateTypeDto.cell,
      })

    if (cellAlreadyExists) {
      throw new DegreeCertificateAlreadyExists(
        `La celda de calificación con código ${createCellGradeDegreeCertificateTypeDto.cell} ya existe`,
      )
    }

    const cell = this.cellsGradeDegreeCertificateTypeRepository.create({
      ...createCellGradeDegreeCertificateTypeDto,
      certificateType: {
        id: createCellGradeDegreeCertificateTypeDto.certificateTypeId,
      },
      gradeTextVariable: `${createCellGradeDegreeCertificateTypeDto.gradeVariable}_TEXT`,
    })

    if (!cell) {
      throw new DegreeCertificateBadRequestError(
        'Los datos de la celda de calificación son incorrectos',
      )
    }

    const newCell = await this.cellsGradeDegreeCertificateTypeRepository.save(
      cell,
    )

    return new ApiResponseDto(
      'Celda de calificación creada correctamente',
      newCell,
    )
  }

  async updateCellGradeByCertificateType(
    id: number,
    updateCellGradeDegreeCertificateTypeDto: UpdateCellGradeDegreeCertificateTypeDto,
  ) {
    const gradeTextVariable =
      updateCellGradeDegreeCertificateTypeDto.gradeVariable
        ? `${updateCellGradeDegreeCertificateTypeDto.gradeVariable}_TEXT`
        : undefined

    const cell = await this.cellsGradeDegreeCertificateTypeRepository.preload({
      id,
      ...updateCellGradeDegreeCertificateTypeDto,
      certificateType: {
        id: updateCellGradeDegreeCertificateTypeDto.certificateTypeId,
      },
      gradeTextVariable,
    })

    if (!cell) {
      throw new DegreeCertificateNotFoundError(
        `La celda de calificación con id ${id} no existe`,
      )
    }

    const cellUpdated =
      await this.cellsGradeDegreeCertificateTypeRepository.save(cell)

    return new ApiResponseDto(
      'Celda de calificación actualizada correctamente',
      cellUpdated,
    )
  }

  async deleteCellGradeByCertificateType(id: number) {
    const cell = this.cellsGradeDegreeCertificateTypeRepository.findOneBy({
      id,
    })

    if (!cell) {
      throw new DegreeCertificateNotFoundError(
        `La celda de calificación con id ${id} no existe`,
      )
    }

    await this.cellsGradeDegreeCertificateTypeRepository.delete({ id })

    return new ApiResponseDto('Celda de calificación eliminada correctamente', {
      success: true,
    })
  }

  async getCellsVariables(cells, gradesSheetDriveId) {
    const cellsVariables = {}

    const cellsDataPromises = cells.map(async (cell) => {
      const values = await this.filesService.getValuesFromSheet(
        gradesSheetDriveId,
        DEGREE_CERTIFICATE_GRADES.DEFAULT_SHEET + cell.cell,
      )

      const cleanValues = values.values ?? []
      const value = cleanValues.length > 0 ? cleanValues[0][0] : '0.0'
      const textValue = transformNumberToWords(Number(value)).toLowerCase()

      cellsVariables[`{{${cell.gradeVariable}}}`] = value
      cellsVariables[`{{${cell.gradeTextVariable}}}`] = textValue
    })

    await Promise.all(cellsDataPromises)

    return cellsVariables
  }

  async generateDocument(id: number) {
    const degreeCertificate = await this.degreeCertificateRepository.findOne({
      where: { id },
      relationLoadStrategy: 'join',
      relations: {
        student: {
          canton: true,
        },
        career: {
          coordinator: true,
        },
        certificateType: true,
        certificateStatus: true,
        degreeModality: true,
        room: true,
        submoduleYearModule: true,
      },
    })

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

    const certificateStatusType = await this.findCertificateStatusType(
      degreeCertificate.certificateType.id,
      degreeCertificate.certificateStatus.id,
    )

    if (!certificateStatusType) {
      throw new DegreeCertificateNotFoundError(
        `No se encontró el estado de certificado ${degreeCertificate.certificateStatus.code} para el tipo de certificado ${degreeCertificate.certificateType.name}`,
      )
    }

    // TODO: Ask about the limit of intership and vinculation hours to validate, at the moment it will only verify that they are not null
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

    const gradeCells = await this.getGradeCellsByCertificateType(
      degreeCertificate.certificateType.id,
    )

    const gradeCellsData = await this.getCellsVariables(
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
    const degreeCertificate = await this.degreeCertificateRepository.findOne({
      where: { id },
      relationLoadStrategy: 'join',
      relations: {
        student: true,
        certificateType: true,
        certificateStatus: true,
        degreeModality: true,
        room: true,
        submoduleYearModule: true,
      },
    })

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
      if (!(await this.revokeGradeSheet(certificateUpdated))) {
        throw new DegreeCertificateConflict(
          'No se pudo anular la hoja de notas anterior del certificado',
        )
      }

      const { data: UpdatedCertificatedGradeSheet } =
        await this.generateGradeSheet(degreeCertificatePreloaded)

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
