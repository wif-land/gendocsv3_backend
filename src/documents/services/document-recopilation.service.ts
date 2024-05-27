import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { CouncilEntity } from '../../councils/entities/council.entity'
import { DataSource } from 'typeorm'
import { DocumentEntity } from '../entities/document.entity'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { getCouncilPath } from '../helpers/path-helper'
import { MIMETYPES } from '../../shared/constants/mime-types'
import { DEFAULT_VARIABLE } from '../../shared/enums/default-variable'

@Injectable()
export class DocumentRecopilationService {
  filesService: any
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getCouncilAndValidate(councilId: number) {
    const council = await this.dataSource.manager
      .getRepository(CouncilEntity)
      .findOne({
        where: { id: councilId },
        relations: {
          attendance: {
            functionary: true,
          },
          module: true,
        },
      })

    if (!council) {
      throw new NotFoundException('Consejo no encontrado')
    }

    if (!council.isActive) {
      throw new ConflictException('El consejo no ha sido cerrado')
    }

    return council
  }

  async generateRecopilationDocuments(councilId: number) {
    const council = await this.getCouncilAndValidate(councilId)

    const documents = await this.dataSource.manager
      .getRepository(DocumentEntity)
      .find({
        where: {
          numerationDocument: {
            council: {
              id: councilId,
            },
          },
        },
      })

    if (!documents) {
      throw new NotFoundException('Documentos no encontrados')
    }

    const councilPath = getCouncilPath(council)
    const tempDocxPath = `${councilPath}/temp/`
    const prepareDirectory = await this.filesService.resolveDirectory(
      councilPath,
    )
    const prepareDocxDirectory = await this.filesService.resolveDirectory(
      tempDocxPath,
    )

    const preparedDocuments = documents.map(
      async (document) => await this.prepareDocument(document, council),
    )

    const resolvedDocuments = Promise.all(preparedDocuments)

    return new ApiResponseDto('Recopilación de documentos creada', {
      documentsRecopilated: (await resolvedDocuments).length,
    })
  }

  async prepareDocument(document: DocumentEntity, council: CouncilEntity): any {
    const blob = await this.filesService.exportAsset(
      document.driveId,
      MIMETYPES.DOCX,
    )

    if (!blob) {
      throw new NotFoundException('Documento no encontrado')
    }

    const councilPath = getCouncilPath(council)
    const tempDocxPath = `${councilPath}/temp/`

    const savedDownloadedDocument =
      await this.filesService.saveDownloadedDocument(
        document.id.toString(),
        tempDocxPath,
        blob,
      )

    const xmlDocument = await this.filesService.unzipDocument(
      savedDownloadedDocument,
    )

    const filteredDocument = await this.filesService.filterDocument(
      xmlDocument,
      DEFAULT_VARIABLE.FROM,
      DEFAULT_VARIABLE.TO,
    )

    return filteredDocument
  }

  async generateRecopilationDocument(councilId: number) {
    const council = await this.dataSource.manager
      .getRepository(CouncilEntity)
      .findOne({
        where: { id: councilId },
        relations: {
          attendance: {
            functionary: true,
          },
          module: true,
          submoduleYearModule: {
            yearModule: true,
          },
        },
      })

    const councilWithRecopilation = await this.dataSource.manager
      .getRepository(CouncilEntity)
      .findAndCount({
        where: {
          recopilationDriveId: null,
        },
      })

    if (!council) {
      throw new NotFoundException('Consejo no encontrado')
    }

    const docCouncil = await this.filesService.createDocumentByParentIdAndCopy(
      'ACTA-',
      council.driveId,
      council.module.compilationTemplateDriveId,
    )

    if (!docCouncil) {
      throw new ConflictException('Error al crear el documento')
    }

    const { data: recopilationVariblesData } =
      await this.variableService.getRecopilationVariables(
        councilWithRecopilation[1] ?? 1,
        council,
      )
    const { data: replacedVariables } =
      await this.filesService.replaceTextOnDocument(
        recopilationVariblesData,
        docCouncil.data,
      )

    if (!replacedVariables) {
      throw new ConflictException('Error al reemplazar variables')
    }

    const updatedCouncil = await this.dataSource.manager
      .getRepository(CouncilEntity)
      .update(councilId, {
        recopilationDriveId: docCouncil.data,
      })

    if (!updatedCouncil) {
      throw new ConflictException('Error al actualizar el consejo')
    }

    return new ApiResponseDto('Documento de recopilación creado', {
      council: updatedCouncil,
    })
  }
}
