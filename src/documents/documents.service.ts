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
    let document = undefined
    let documentFunctionaries

    const numeration = await this.numerationDocumentService.create({
      number: createDocumentDto.number,
      councilId: createDocumentDto.councilId,
    })

    if (!numeration) {
      throw new Error('Numeration not created')
    }

    try {
      let functionariesData = undefined
      let studentData = undefined

      document = this.documentsRepository.create({
        ...createDocumentDto,
        numerationDocument: { id: numeration.id },
        templateProcess: { id: createDocumentDto.templateId },
        user: { id: createDocumentDto.userId },
      })

      if (!document) {
        await this.numerationDocumentService.remove(numeration.id)
        throw new Error('Document not created')
      }
      await this.documentsRepository.save(document)

      const savedDocument = await this.documentsRepository.findOneOrFail({
        where: { id: document.id },
        relations: [
          'numerationDocument',
          'numerationDocument.council',
          'numerationDocument.council.attendance',
          'numerationDocument.council.attendance.functionary',
          'user',
          'templateProcess',
          'documentFunctionaries',
          'documentFunctionaries.functionary',
        ],
      })

      const generalData = await this.variableService.getGeneralVariables(
        savedDocument,
      )

      const councilData = await this.variableService.getCouncilVariables(
        savedDocument,
      )

      const positionsData = await this.variableService.getPositionVariables()
      const customVariablesData =
        await this.variableService.getCustomVariables()

      if (createDocumentDto.functionariesIds) {
        documentFunctionaries = createDocumentDto.functionariesIds.map(
          (functionaryId) =>
            this.documentFunctionaryRepository.create({
              document: { id: savedDocument.id },
              functionary: { id: functionaryId },
            }),
        )

        documentFunctionaries = await this.documentFunctionaryRepository.save(
          documentFunctionaries,
        )

        const documentFunctionariesSaved =
          await this.documentFunctionaryRepository.find({
            where: { document: { id: savedDocument.id } },
            relations: ['functionary'],
          })

        functionariesData = await this.variableService.getFunctionaryVariables(
          documentFunctionariesSaved,
        )
      }

      if (createDocumentDto.studentId) {
        const qb = this.dataSource
          .createQueryBuilder(Student, 'student')
          .leftJoinAndSelect('student.career', 'career')
          .leftJoinAndSelect('career.coordinator', 'coordinator')
          .where('student.id = :id', { id: createDocumentDto.studentId })

        const student = await qb.getOne()
        // eslint-disable-next-line require-atomic-updates
        savedDocument.student = student

        await this.documentsRepository.update(savedDocument.id, {
          student: { id: student.id },
        })

        studentData = await this.variableService.getStudentVariables(
          savedDocument,
        )
      }

      const variables = {
        [DefaultVariable.PREFEX_GENERAL]: generalData,
        [DefaultVariable.PREFIX_CONSEJO]: councilData,
        [DefaultVariable.PREFIX_DOCENTES]: functionariesData
          ? functionariesData
          : [],
        [DefaultVariable.PREFIX_ESTUDIANTE]: studentData ? studentData : [],
        [DefaultVariable.PREFIX_CARGOS]: positionsData,
        [DefaultVariable.PREFIX_CUSTOM]: customVariablesData,
      }

      const variablesJson = JSON.stringify(variables)

      // eslint-disable-next-line require-atomic-updates
      savedDocument.variables = JSON.parse(variablesJson)

      driveId = await this.filesService.createDocumentByParentIdAndCopy(
        formatNumeration(numeration.number),
        savedDocument.numerationDocument.council.driveId,
        savedDocument.templateProcess.driveId,
      )
      const formatVariables = {
        ...generalData,
        ...councilData,
        // eslint-disable-next-line no-extra-parens
        ...(functionariesData ? functionariesData : []),
        // eslint-disable-next-line no-extra-parens
        ...(studentData ? studentData : []),
        ...positionsData,
        ...customVariablesData,
      }
      await this.filesService.replaceTextOnDocument(formatVariables, driveId)

      return await this.documentsRepository.update(savedDocument.id, {
        driveId,
        variables: JSON.stringify(formatVariables),
      })
    } catch (error) {
      if (driveId) {
        await this.filesService.remove(driveId)
      }

      if (documentFunctionaries) {
        await this.documentFunctionaryRepository.delete(
          documentFunctionaries.map((item) => item.id),
        )
      }

      if (document) {
        await this.documentsRepository.delete(document.id)
      }
      if (numeration) {
        await this.numerationDocumentService.remove(numeration.id)
      }
      throw new Error(error.message)
    }
  }

  async findAll() {
    try {
      const documents = await this.documentsRepository.find({
        relations: ['numerationDocument', 'user', 'student', 'templateProcess'],
      })
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
          'numerationDocument',
          'numerationDocument.council',
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
