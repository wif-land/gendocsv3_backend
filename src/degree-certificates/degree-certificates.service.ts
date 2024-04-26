import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Not, Repository } from 'typeorm'
import { CreateCertificateStatusDto } from './dto/create-certificate-status.dto'
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto'
import { CreateDegreeCertificateDto } from './dto/create-degree-certificate.dto'
import { CreateDegreeModalityDto } from './dto/create-degree-modality.dto'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateCertificateStatusDto } from './dto/update-certificate-status.dto'
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto'
import { UpdateDegreeCertificateDto } from './dto/update-degree-certificate.dto'
import { UpdateDegreeModalityDto } from './dto/update-degree-modality.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { CertificateStatusEntity } from './entities/certificate-status.entity'
import { CertificateTypeEntity } from './entities/certificate-type.entity'
import { DegreeCertificateEntity } from './entities/degree-certificate.entity'
import { DegreeModalityEntity } from './entities/degree-modality.entity'
import { RoomEntity } from './entities/room.entity'
import { DegreeCertificateBadRequestError } from './errors/degree-certificate-bad-request'
import { DegreeCertificateAlreadyExists } from './errors/degree-certificate-already-exists'
import { DegreeCertificateNotFoundError } from './errors/degree-certificate-not-found'
import { YearModuleService } from '../year-module/year-module.service'
import {
  DEGREE_MODULES,
  DEGREE_CERTIFICATE_GRADES,
} from '../shared/enums/degree-certificates'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { FilesService } from '../files/files.service'
import { StudentsService } from '../students/students.service'
import { StudentEntity } from '../students/entities/student.entity'
import { CertificateTypeCareerEntity } from './entities/certicate-type-career.entity'
import { DegreeCertificateTypeNotFoundError } from './errors/degree-certificate-type-not-found'
import { VariablesService } from '../variables/variables.service'
import { CertificateTypeStatusEntity } from './entities/certificate-type-status.entity'
import { CellsGradeDegreeCertificateTypeEntity } from './entities/cells-grade-degree-certificate-type.entity'
import { CreateCellGradeDegreeCertificateTypeDto } from './dto/create-cells-grade-degree-certificate-type.dto'
import { transformNumberToWords } from '../shared/utils/number'
import { DegreeCertificateAttendanceService } from '../degree-certificate-attendance/degree-certificate-attendance.service'

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
    const certificateTypes = await this.cetificateTypeCareerRepository.findBy({
      carrer: { id: carrerId },
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

  async showCertificateTypesCarrerByCarrer(carrerId: number) {
    const certificateTypes = await this.getCertificateTypesCarrerByCarrer(
      carrerId,
    )

    return new ApiResponseDto(
      'Listado de modalidades de grado obtenido exitosamente',
      certificateTypes,
    )
  }

  async showCertificateStatusByType(certificateTypeId: number) {
    const certificateStatus = await this.getCertificateStatusByType(
      certificateTypeId,
    )

    return new ApiResponseDto(
      'Listado de estados de certificado obtenido exitosamente',
      certificateStatus,
    )
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

  async showLastNumberToRegister(
    carrerId: number,
  ): Promise<ApiResponseDto<number>> {
    const number = await this.getLastNumberToRegister(carrerId)

    return new ApiResponseDto('Siguiente número de registro encontrado', number)
  }

  async findAll(): Promise<ApiResponseDto<DegreeCertificateEntity[]>> {
    const degreeCertificates = await this.degreeCertificateRepository.find({
      relationLoadStrategy: 'join',
      relations: {
        student: true,
        career: true,
        certificateType: true,
        certificateStatus: true,
        degreeModality: true,
      },
    })

    return new ApiResponseDto(
      'Listado de certificados obtenido exitosamente',
      degreeCertificates,
    )
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

  async create(dto: CreateDegreeCertificateDto) {
    if (await this.findReplicate(dto)) {
      throw new DegreeCertificateAlreadyExists(
        'Ya existe un certificado con los mismos datos',
      )
    }

    const student: StudentEntity = (
      await this.studentService.findOne(dto.studentId)
    ).data

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

    const degreeCertificate = this.degreeCertificateRepository.create({
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
          student: true,
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

  async showGradeCellsByCertificateType(certificateTypeId: number) {
    const cells = await this.getGradeCellsByCertificateType(certificateTypeId)

    return new ApiResponseDto(
      'Listado de celdas de calificación obtenido exitosamente',
      cells,
    )
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

  async updateCellDegreeByCertificateType(
    id: number,
    updateCellGradeDegreeCertificateTypeDto: CreateCellGradeDegreeCertificateTypeDto,
  ) {
    const cell = await this.cellsGradeDegreeCertificateTypeRepository.preload({
      id,
      ...updateCellGradeDegreeCertificateTypeDto,
      certificateType: {
        id: updateCellGradeDegreeCertificateTypeDto.certificateTypeId,
      },
      gradeTextVariable: `${updateCellGradeDegreeCertificateTypeDto.gradeVariable}_TEXT`,
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

  async deleteCellDegreeByCertificateType(id: number) {
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

    // TODO: Make the method getDegreeCertificateVariables
    // TODO: Make the gradesSheet logic to variables
    // TODO: Generate and insert the templates on migrations and seeders
    // TODO: Test the generation of the documents
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
        driveId,
      })

    return new ApiResponseDto(
      'Documento generado correctamente',
      degreeCertificateUpdated,
    )
  }

  async update(id: number, dto: UpdateDegreeCertificateDto) {
    const degreeCertificate = await this.degreeCertificateRepository.preload({
      id,
      student: { id: dto.studentId },
      certificateType: { id: dto.certificateTypeId },
      certificateStatus: { id: dto.certificateStatusId },
      degreeModality: { id: dto.degreeModalityId },
      room: { id: dto.roomId },
      ...dto,
    })

    if (!degreeCertificate) {
      throw new DegreeCertificateNotFoundError(
        `El certificado con id ${id} no existe`,
      )
    }

    const certificateUpdated = await this.degreeCertificateRepository.save(
      degreeCertificate,
    )

    return new ApiResponseDto(
      'Certificado actualizado correctamente',
      certificateUpdated,
    )
  }

  async findAllCertificateStatus() {
    const certificateStatus = await this.certificateStatusRepository.find()

    return new ApiResponseDto(
      'Listado de estados de certificado obtenido exitosamente',
      certificateStatus,
    )
  }

  async createCertificateStatus(dto: CreateCertificateStatusDto) {
    if (
      this.certificateStatusRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `El estado de certificado con código ${dto.code} ya existe`,
      )
    }

    const certificateStatus = this.certificateStatusRepository.create(dto)

    if (!certificateStatus) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del estado de certificado son incorrectos',
      )
    }

    const newCertificateStatus = await this.certificateStatusRepository.save(
      certificateStatus,
    )

    return new ApiResponseDto(
      'Estado de certificado creado correctamente',
      newCertificateStatus,
    )
  }

  async updateCertificateStatus(
    id: number,
    updateCertificateStatusDto: UpdateCertificateStatusDto,
  ) {
    const certificateStatus = await this.certificateStatusRepository.preload({
      id,
      ...updateCertificateStatusDto,
    })

    if (!certificateStatus) {
      throw new DegreeCertificateNotFoundError(
        `El estado de certificado con id ${id} no existe`,
      )
    }

    const certificateStatusUpdated =
      await this.certificateStatusRepository.save(certificateStatus)

    return new ApiResponseDto(
      'Estado de certificado actualizado correctamente',
      certificateStatusUpdated,
    )
  }

  async deleteCertificateStatus(id: number) {
    const certificateStatus = this.certificateStatusRepository.findOneBy({ id })

    if (!certificateStatus) {
      throw new DegreeCertificateNotFoundError(
        `El estado de certificado con id ${id} no existe`,
      )
    }

    await this.certificateStatusRepository.save({
      ...certificateStatus,
      isActive: false,
    })

    return new ApiResponseDto('Estado de certificado eliminado correctamente', {
      success: true,
    })
  }

  async findAllCertificateTypes() {
    const certificateTypes = await this.certificateTypeRepository.find()

    return new ApiResponseDto(
      'Listado de tipos de certificado obtenido exitosamente',
      certificateTypes,
    )
  }

  async createCertificateType(dto: CreateCertificateTypeDto) {
    if (
      this.certificateTypeRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `El tipo de certificado con código ${dto.code} ya existe`,
      )
    }

    const certificateType = this.certificateTypeRepository.create(dto)

    if (!certificateType) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del tipo de certificado son incorrectos',
      )
    }

    const newCertificateType = await this.certificateTypeRepository.save(
      certificateType,
    )

    return new ApiResponseDto(
      'Tipo de certificado creado correctamente',
      newCertificateType,
    )
  }

  async updateCertificateType(
    id: number,
    updateCertificateTypeDto: UpdateCertificateTypeDto,
  ) {
    const certificateType = await this.certificateTypeRepository.preload({
      id,
      ...updateCertificateTypeDto,
    })

    if (!certificateType) {
      throw new DegreeCertificateNotFoundError(
        `El tipo de certificado con id ${id} no existe`,
      )
    }

    const certificateTypeUpdated = await this.certificateTypeRepository.save(
      certificateType,
    )

    return new ApiResponseDto(
      'Tipo de certificado actualizado correctamente',
      certificateTypeUpdated,
    )
  }

  async deleteCertificateType(id: number) {
    const certificateType = this.certificateTypeRepository.findOneBy({ id })

    if (!certificateType) {
      throw new DegreeCertificateNotFoundError(
        `El tipo de certificado con id ${id} no existe`,
      )
    }

    await this.certificateTypeRepository.save({
      ...certificateType,
      isActive: false,
    })

    return new ApiResponseDto('Tipo de certificado eliminado correctamente', {
      success: true,
    })
  }

  async findAllDegreeModalities() {
    const degreeModalities = await this.degreeModalityRepository.find()

    return new ApiResponseDto(
      'Listado de modalidades de grado obtenido exitosamente',
      degreeModalities,
    )
  }

  async createDegreeModality(dto: CreateDegreeModalityDto) {
    if (
      this.degreeModalityRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `La modalidad de grado con código ${dto.code} ya existe`,
      )
    }

    const degreeModality = this.degreeModalityRepository.create(dto)

    if (!degreeModality) {
      throw new DegreeCertificateBadRequestError(
        'Los datos de la modalidad de grado son incorrectos',
      )
    }

    const newDegreeModality = await this.degreeModalityRepository.save(
      degreeModality,
    )

    return new ApiResponseDto(
      'Modalidad de grado creada correctamente',
      newDegreeModality,
    )
  }

  async updateDegreeModality(id: number, dto: UpdateDegreeModalityDto) {
    const degreeModality = await this.degreeModalityRepository.preload({
      id,
      ...dto,
    })

    if (!degreeModality) {
      throw new DegreeCertificateNotFoundError(
        `La modalidad de grado con id ${id} no existe`,
      )
    }

    const degreeModalityUpdated = await this.degreeModalityRepository.save(
      degreeModality,
    )

    return new ApiResponseDto(
      'Modalidad de grado actualizada correctamente',
      degreeModalityUpdated,
    )
  }

  async deleteDegreeModality(id: number) {
    const degreeModality = this.degreeModalityRepository.findOneBy({ id })

    if (!degreeModality) {
      throw new DegreeCertificateNotFoundError(
        `La modalidad de grado con id ${id} no existe`,
      )
    }

    await this.degreeModalityRepository.save({
      ...degreeModality,
      isActive: false,
    })

    return new ApiResponseDto('Modalidad de grado eliminada correctamente', {
      success: true,
    })
  }

  async findAllRooms() {
    const rooms = await this.roomRepository.find()

    return new ApiResponseDto('Listado de salones obtenido exitosamente', rooms)
  }

  async createRoom(dto: CreateRoomDto) {
    if (
      this.roomRepository.findOneBy({
        name: dto.name,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `El salón con nombre ${dto.name} ya existe`,
      )
    }

    const room = this.roomRepository.create(dto)

    if (!room) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del salón son incorrectos',
      )
    }

    const newRoom = await this.roomRepository.save(room)

    return new ApiResponseDto('Salón creado correctamente', newRoom)
  }

  async updateRoom(id: number, dto: UpdateRoomDto) {
    const room = await this.roomRepository.preload({
      id,
      ...dto,
    })

    if (!room) {
      throw new DegreeCertificateNotFoundError(
        `El salón con id ${id} no existe`,
      )
    }

    const roomUpdated = await this.roomRepository.save(room)

    return new ApiResponseDto('Salón actualizado correctamente', roomUpdated)
  }

  async deleteRoom(id: number) {
    const room = this.roomRepository.findOneBy({ id })

    if (!room) {
      throw new DegreeCertificateNotFoundError(
        `El salón con id ${id} no existe`,
      )
    }

    await this.roomRepository.save({
      ...room,
      isActive: false,
    })

    return new ApiResponseDto('Salón eliminado correctamente', {
      success: true,
    })
  }
}
