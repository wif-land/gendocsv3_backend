import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { CouncilEntity } from '../../councils/entities/council.entity'
import { DocumentEntity } from '../entities/document.entity'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { getCouncilPath, getYearModulePath } from '../helpers/path-helper'
import { MIMETYPES } from '../../shared/constants/mime-types'
import { DEFAULT_VARIABLE } from '../../shared/enums/default-variable'
import { FilesService } from '../../files/services/files.service'
import { formatDateText } from '../../shared/utils/date'
import { VariablesService } from '../../variables/variables.service'
import { DataSource } from 'typeorm'
import { IReplaceText } from '../../shared/interfaces/replace-text'
import { formatNumeration } from '../../shared/utils/string'

@Injectable()
export class DocumentRecopilationService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly filesService: FilesService,
    private readonly variableService: VariablesService,
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
          submoduleYearModule: {
            yearModule: true,
          },
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

    const documents = await this.getDocumentsByCouncilId(councilId)

    if (!documents) {
      throw new NotFoundException('Documentos no encontrados')
    }

    const councilPath = getCouncilPath(council)
    const tempDocxPath = `${councilPath}/temp/`
    const yearModulePath = getYearModulePath(
      council.submoduleYearModule.yearModule,
    )

    await this.filesService.resolveDirectory(councilPath)

    await this.filesService.resolveDirectory(tempDocxPath)

    const separator = await this.filesService.exportAsset(
      council.module.separatorTemplateDriveId,
      MIMETYPES.DOCX,
    )

    if (!separator) {
      throw new NotFoundException('Separador no encontrado')
    }

    await this.filesService.saveDownloadedDocument(
      'separator.docx',
      yearModulePath,
      separator,
    )

    const preparedDocuments = documents.map(
      async (document) =>
        await this.prepareDocument(
          document,
          council,
          `${yearModulePath}/separator.docx`,
        ),
    )

    const resolvedDocuments = await Promise.all(preparedDocuments)

    return new ApiResponseDto('Recopilación de documentos creada', {
      documentsRecopilated: resolvedDocuments,
    })
  }

  async prepareDocument(
    document: DocumentEntity,
    council: CouncilEntity,
    separatorPath: string,
  ): Promise<string> {
    const blob = await this.filesService.exportAsset(
      document.driveId,
      MIMETYPES.DOCX,
    )

    if (!blob) {
      throw new NotFoundException('Documento no encontrado')
    }

    const councilPath = getCouncilPath(council)
    const tempDocxPath = `${councilPath}/temp/`

    const savedDownloadedDocumentPath =
      await this.filesService.saveDownloadedDocument(
        `${document.numerationDocument.number.toString()}.docx`,
        tempDocxPath,
        blob,
      )

    const filteredDocumentPath = await this.filesService.filterDocument(
      savedDownloadedDocumentPath,
      DEFAULT_VARIABLE.FROM,
      DEFAULT_VARIABLE.TO,
    )

    if (!filteredDocumentPath) {
      throw new ConflictException('Error al filtrar el documento')
    }

    const replaceEntries: IReplaceText = {
      [DEFAULT_VARIABLE.SEPARATOR_NUMDOC]: formatNumeration(
        document.numerationDocument.number,
      ),
      [DEFAULT_VARIABLE.SEPARATOR_YEAR]:
        document.numerationDocument.council.submoduleYearModule.yearModule.year.toString(),
    }

    const replacedSeparator =
      await this.filesService.copyAndReplaceTextOnLocalDocument(
        `${document.numerationDocument.number.toString()}-separator.docx`,
        replaceEntries,
        separatorPath,
        tempDocxPath,
      )

    if (!replacedSeparator) {
      throw new ConflictException('Error al reemplazar el separador')
    }

    return filteredDocumentPath
  }

  async mergeDocuments(councilId: number) {
    const council = await this.getCouncilAndValidate(councilId)

    const councilPath = getCouncilPath(council)
    const tempDocxPath = `${councilPath}/temp/`
    const generatedCouncilPath = `${councilPath}/generated`

    await this.filesService.resolveDirectory(generatedCouncilPath)

    const documents = await this.filesService.getFilesFromDirectory(
      tempDocxPath,
    )

    const mergedDocumentPath = await this.filesService.mergeDocuments(
      `${council.name}-Recopilación-${formatDateText(council.date)}`,
      documents,
      generatedCouncilPath,
    )

    return new ApiResponseDto('Documentos fusionados', {
      mergedDocumentPath,
    })
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

  async getDocumentsByCouncilId(councilId: number) {
    const documents = await this.dataSource
      .getRepository(DocumentEntity)
      .createQueryBuilder('document')
      .select([
        'document.id',
        'document.createdAt',
        'document.driveId',
        'document.description',
      ])
      .leftJoinAndSelect('document.numerationDocument', 'numerationDocument')
      .leftJoinAndSelect('numerationDocument.council', 'council')
      .leftJoinAndSelect('council.module', 'module')
      .leftJoinAndSelect('council.submoduleYearModule', 'submoduleYearModule')
      .leftJoinAndSelect('submoduleYearModule.yearModule', 'yearModule')
      .leftJoinAndSelect('council.attendance', 'attendance')
      .leftJoinAndSelect('attendance.functionary', 'functionary')
      .leftJoinAndSelect('document.user', 'user')
      .leftJoinAndSelect('document.student', 'student')
      .leftJoinAndSelect('student.career', 'career')
      .leftJoinAndSelect('student.canton', 'canton')
      .leftJoinAndSelect('document.templateProcess', 'templateProcess')
      .leftJoinAndSelect(
        'document.documentFunctionaries',
        'documentFunctionaries',
      )
      .leftJoinAndSelect('documentFunctionaries.functionary', 'functionarys')
      .where('council.id = :councilId', { councilId })
      .getMany()

    if (!documents) {
      throw new NotFoundException('Documentos no encontrados')
    }

    return documents
  }
}
