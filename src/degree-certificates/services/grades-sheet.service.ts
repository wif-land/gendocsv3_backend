import { InjectRepository } from '@nestjs/typeorm'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'
import { FilesService } from '../../files/services/files.service'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { CellsGradeDegreeCertificateTypeEntity } from '../entities/cells-grade-degree-certificate-type.entity'
import { DEGREE_CERTIFICATE_GRADES } from '../../shared/enums/degree-certificates'
import { transformNumberToWords } from '../../shared/utils/number'
import { CreateCellGradeDegreeCertificateTypeDto } from '../dto/create-cells-grade-degree-certificate-type.dto'
import { UpdateCellGradeDegreeCertificateTypeDto } from '../dto/update-cells-grade-degree-certificate-type.dto'
import { DegreeCertificateAlreadyExists } from '../errors/degree-certificate-already-exists'
import { DegreeCertificateNotFoundError } from '../errors/degree-certificate-not-found'
import { ReturnMethodDto } from '../../shared/dtos/return-method.dto'

@Injectable()
export class GradesSheetService {
  constructor(
    private readonly filesService: FilesService,

    @InjectRepository(DegreeCertificateEntity)
    private readonly degreeCertificateRepository: Repository<DegreeCertificateEntity>,

    @InjectRepository(CellsGradeDegreeCertificateTypeEntity)
    private readonly cellsGradeDegreeCertificateTypeRepository: Repository<CellsGradeDegreeCertificateTypeEntity>,
  ) {}

  async generateGradeSheet(
    degreeCertificate: DegreeCertificateEntity,
  ): Promise<ReturnMethodDto<DegreeCertificateEntity>> {
    const gradeSheet = await this.filesService.createDocumentByParentIdAndCopy(
      `GR ${degreeCertificate.student.dni} | ${degreeCertificate.certificateType.code} - ${degreeCertificate.certificateStatus.code}`,
      degreeCertificate.submoduleYearModule.driveId,
      degreeCertificate.certificateType.driveId,
    )

    if (!gradeSheet) {
      return new ReturnMethodDto(
        null,
        new DegreeCertificateBadRequestError(
          'Error al generar la hoja de calificaciones en Google Drive, intente nuevamente',
        ),
      )
    }

    const degreeCertificateUpdated =
      await this.degreeCertificateRepository.save({
        ...degreeCertificate,
        gradesSheetDriveId: gradeSheet.data,
      })

    return new ReturnMethodDto(degreeCertificateUpdated)
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

  async replaceCellsVariables({
    cellsVariables,
    gradesSheetDriveId,
  }: {
    cellsVariables: [string, string][]
    gradesSheetDriveId: string
  }) {
    const responses: {
      message: string
      error: DegreeCertificateBadRequestError
    }[] = []

    const { data: replaced } = await this.filesService.replaceValuesOnCells(
      gradesSheetDriveId,
      DEGREE_CERTIFICATE_GRADES.DEFAULT_RANGE_ID,
      cellsVariables,
    )

    if (!replaced) {
      responses.push({
        message: `Error reemplazando valores en celdas de la hoja de calificaciones`,
        error: new DegreeCertificateBadRequestError(
          `Error reemplazando valores en celdas de la hoja de calificaciones para el certificado`,
        ),
      })
    }

    return {
      message: `Valores reemplazados correctamente en celdas de la hoja de calificaciones`,
      error: null,
    }
  }
}
