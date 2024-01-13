import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateDocumentDto } from './dto/create-document.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DocumentEntity } from './entities/document.entity'
import { NumerationDocumentService } from '../numeration-document/numeration-document.service'
import { VariablesService } from '../variables/variables.service'
import { DocumentFunctionaryEntity } from './entities/document-functionary.entity'
import { DefaultVariable } from '../shared/enums/default-variable'
import { Student } from '../students/entities/student.entity'
import { FilesService } from '../files/files.service'
import { formatNumeration } from '../shared/utils/string'
import { ResponseDocumentDto } from './dto/response-document'

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentsRepository: Repository<DocumentEntity>,

    @InjectRepository(DocumentFunctionaryEntity)
    private documentFunctionaryRepository: Repository<DocumentFunctionaryEntity>,

    private readonly dataSource: DataSource,
    private readonly numerationDocumentService: NumerationDocumentService,
    private readonly variableService: VariablesService,
    private readonly filesService: FilesService,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    let driveId = undefined

    const numeration = await this.numerationDocumentService.create({
      number: createDocumentDto.number,
      councilId: createDocumentDto.councilId,
    })

    try {
      let documentFunctionaries
      let functionariesData = undefined
      let studentData = undefined

      const document = this.documentsRepository.create({
        ...createDocumentDto,
        numerationDocument: { id: numeration.id },
        templateProcess: { id: createDocumentDto.templateId },
        user: { id: createDocumentDto.userId },
      })

      if (!document) {
        await this.numerationDocumentService.remove(numeration.id)
        throw new Error('Document not created')
      }

      const generalData = await this.variableService.getGeneralVariables(
        document,
      )

      const councilData = await this.variableService.getCouncilVariables(
        document,
      )

      const customVariablesData =
        await this.variableService.getCustomVariables()

      if (createDocumentDto.functionariesIds) {
        documentFunctionaries = createDocumentDto.functionariesIds.map(
          (functionaryId) =>
            this.documentFunctionaryRepository.create({
              document: { id: document.id },
              functionary: { id: functionaryId },
            }),
        )

        functionariesData = await this.variableService.getFunctionaryVariables(
          documentFunctionaries,
        )
      }

      if (createDocumentDto.studentId) {
        const qb = this.dataSource
          .createQueryBuilder(Student, 'student')
          .leftJoinAndSelect('student.career', 'career')
          .where('student.id = :id', { id: createDocumentDto.studentId })

        const student = await qb.getOne()
        // eslint-disable-next-line require-atomic-updates
        document.student = student

        studentData = await this.variableService.getStudentVariables(document)
      }

      const variables = {
        [DefaultVariable.PREFEX_GENERAL]: generalData,
        [DefaultVariable.PREFIX_CONSEJO]: councilData,
        [DefaultVariable.PREFIX_DOCENTES]: functionariesData
          ? functionariesData
          : [],
        [DefaultVariable.PREFIX_ESTUDIANTE]: studentData ? studentData : [],
        [DefaultVariable.PREFIX_CUSTOM]: customVariablesData,
      }

      const variablesJson = JSON.stringify(variables)

      // eslint-disable-next-line require-atomic-updates
      document.variables = JSON.parse(variablesJson)

      driveId = await this.filesService.createDocumentByParentIdAndCopy(
        formatNumeration(numeration.number),
        numeration.council.driveId,
        document.templateProcess.driveId,
      )

      await this.filesService.replaceTextOnDocument(variables, driveId)

      return await this.documentsRepository.save(document)
    } catch (error) {
      if (driveId) {
        await this.filesService.remove(driveId)
      }
      await this.numerationDocumentService.remove(numeration.id)
      throw new Error(error.message)
    }
  }

  async findAll() {
    try {
      const documents = await this.documentsRepository.find()

      if (!documents) {
        throw new NotFoundException('Documents not found')
      }
      return documents.map((document) => new ResponseDocumentDto(document))
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const document = await this.documentsRepository.findOne({
        where: { id },
        relations: [
          'numerations',
          'numerations.council',
          'user',
          'student',
          'templateProcess',
          'documentFunctionaries',
          'documentFunctionaries.functionary',
        ],
      })

      if (!document) {
        throw new NotFoundException('Document not found')
      }

      return new ResponseDocumentDto(document)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      const document = await this.documentsRepository.findOne({
        where: { id },
        loadRelationIds: true,
      })

      if (!document) {
        throw new NotFoundException('Document not found')
      }

      await this.documentFunctionaryRepository.delete(document.id)

      const confirmation = await this.numerationDocumentService.documentRemoved(
        document,
      )

      if (!confirmation) {
        throw new ConflictException('Numeration not updated')
      }

      await this.filesService.remove(document.driveId)

      return await this.documentsRepository.delete(document.id)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
