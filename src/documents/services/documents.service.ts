import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateDocumentDto } from '../dto/create-document.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DocumentEntity } from '../entities/document.entity'
import { NumerationDocumentService } from '../../numeration-document/numeration-document.service'
import { VariablesService } from '../../variables/variables.service'
import { DocumentFunctionaryEntity } from '../entities/document-functionary.entity'
import { DEFAULT_VARIABLE } from '../../shared/enums/default-variable'
import { StudentEntity } from '../../students/entities/student.entity'
import { FilesService } from '../../files/services/files.service'
import { formatNumeration } from '../../shared/utils/string'
import { ResponseDocumentDto } from '../dto/response-document'
import { PaginationV2Dto } from '../../shared/dtos/paginationv2.dto'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'

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

    const { data: numeration } = await this.numerationDocumentService.create({
      number: createDocumentDto.number,
      councilId: createDocumentDto.councilId,
    })

    if (!numeration) {
      throw new ConflictException('Numeración no creada')
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
        throw new Error('Error al crear el documento')
      }
      await this.documentsRepository.save(document)

      const savedDocument = await this.documentsRepository.findOneOrFail({
        where: { id: document.id },
        relations: {
          numerationDocument: {
            council: {
              attendance: {
                functionary: true,
              },
            },
          },
          documentFunctionaries: {
            functionary: true,
          },
          templateProcess: true,
          user: true,
        },
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
            relationLoadStrategy: 'join',
            relations: {
              functionary: true,
              document: {
                numerationDocument: {
                  council: {
                    attendance: {
                      functionary: true,
                    },
                  },
                },
              },
            },
          })

        functionariesData = await this.variableService.getFunctionaryVariables(
          documentFunctionariesSaved,
        )
      }

      if (createDocumentDto.studentId) {
        const student = await this.dataSource.manager
          .getRepository(StudentEntity)
          .findOne({
            where: { id: createDocumentDto.studentId },
            relationLoadStrategy: 'join',
            relations: {
              career: {
                coordinator: true,
              },
              canton: {
                province: true,
              },
            },
          })

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
        [DEFAULT_VARIABLE.PREFEX_GENERAL]: generalData.data,
        [DEFAULT_VARIABLE.PREFIX_CONSEJO]: councilData.data,
        [DEFAULT_VARIABLE.PREFIX_DOCENTES]: functionariesData
          ? functionariesData.data
          : [],
        [DEFAULT_VARIABLE.PREFIX_ESTUDIANTE]: studentData
          ? studentData.data
          : [],
        [DEFAULT_VARIABLE.PREFIX_CARGOS]: positionsData.data,
        [DEFAULT_VARIABLE.PREFIX_CUSTOM]: customVariablesData.data,
      }

      const variablesJson = JSON.stringify(variables)

      // eslint-disable-next-line require-atomic-updates
      savedDocument.variables = JSON.parse(variablesJson)

      driveId = (
        await this.filesService.createDocumentByParentIdAndCopy(
          formatNumeration(numeration.number),
          savedDocument.numerationDocument.council.driveId,
          savedDocument.templateProcess.driveId,
        )
      ).data

      const formatVariables = {
        ...generalData.data,
        ...councilData.data,
        // eslint-disable-next-line no-extra-parens
        ...(functionariesData ? functionariesData.data : []),
        // eslint-disable-next-line no-extra-parens
        ...(studentData ? studentData.data : []),
        ...positionsData.data,
        ...customVariablesData.data,
      }

      await this.filesService.replaceTextOnDocument(formatVariables, driveId)

      const finalDocument = await this.documentsRepository.save({
        id: savedDocument.id,
        driveId,
        variables: JSON.stringify(formatVariables),
      })

      return new ApiResponseDto('Documento creado', finalDocument)
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

  async findAll(paginationDto: PaginationV2Dto) {
    const {
      // eslint-disable-next-line no-magic-numbers
      rowsPerPage = 10,
      order = 'ASC',
      orderBy = 'id',
      page = 1,
      moduleId,
    } = paginationDto

    try {
      // Se usa query builder para hacer la consulta por la velocidad de respuesta
      // const documents = await this.documentsRepository.find({
      //   select: {
      //     id: true,
      //     createdAt: true,
      //     driveId: true,
      //     description: true,
      //     variables: false,
      //   },
      //   relations: {
      //     numerationDocument: {
      //       council: {
      //         module: {
      //           defaultAttendance: false,
      //           councils: false,
      //           processes: false,
      //           submodules: false,
      //         },
      //         submoduleYearModule: {
      //           degreeCertificates: false,
      //           processes: false,
      //           yearModule: {
      //             submoduleYearModules: false,
      //           },
      //         },
      //         attendance: {
      //           council: false,
      //           functionary: {
      //             documentFunctionaries: false,
      //           },
      //         },
      //       },
      //     },
      //     user: {
      //       accessModules: false,
      //       councils: false,
      //       degreeCertificates: false,
      //       documents: false,
      //       processes: false,
      //       templateProcesses: false,
      //     },
      //     student: {
      //       career: {
      //         coordinator: false,
      //       },
      //       canton: {
      //         province: false,
      //       },
      //       documents: false,
      //     },
      //     templateProcess: {
      //       documents: false,
      //       process: false,
      //       user: false,
      //     },
      //     documentFunctionaries: {
      //       functionary: {
      //         careers: false,
      //         documentFunctionaries: false,
      //         councilAttendance: false,
      //         positions: false,
      //       },
      //     },
      //   },
      //   order: {
      //     [orderBy]: order.toUpperCase(),
      //   },
      //   take: rowsPerPage,
      //   skip: rowsPerPage * (page - 1),
      //   where: {
      //     numerationDocument: { council: { module: { id: Number(moduleId) } } },
      //   },
      // })
      const documents = await this.documentsRepository
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
        .where('module.id = :moduleId', { moduleId: Number(moduleId) })
        .orderBy(`document.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
        .skip(rowsPerPage * (page - 1))
        .take(rowsPerPage)
        .getMany()

      if (!documents) {
        throw new NotFoundException('Documents not found')
      }

      const count = await this.documentsRepository.count({
        where: {
          numerationDocument: { council: { module: { id: Number(moduleId) } } },
        },
      })

      return new ApiResponseDto('Lista de documentos', {
        count,
        documents: documents.map(
          (document) => new ResponseDocumentDto(document),
        ),
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const document = await this.documentsRepository
        .createQueryBuilder('document')
        .leftJoinAndSelect('document.numerationDocument', 'numerationDocument')
        .leftJoinAndSelect('numerationDocument.council', 'council')
        .leftJoinAndSelect('document.user', 'user')
        .leftJoinAndSelect('document.student', 'student')
        .leftJoinAndSelect('document.templateProcess', 'templateProcess')
        .leftJoinAndSelect(
          'document.documentFunctionaries',
          'documentFunctionaries',
        )
        .leftJoinAndSelect('documentFunctionaries.functionary', 'functionary')
        .where('document.id = :id', { id })
        .getOne()

      if (!document) {
        throw new NotFoundException('Document not found')
      }

      const newDocument = new ResponseDocumentDto(document)

      return new ApiResponseDto('Documento encontrado', newDocument)
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

      const isDeleted = await this.documentsRepository.delete(document.id)

      return new ApiResponseDto(
        isDeleted.affected > 0
          ? 'Documento eliminado'
          : 'Error al eliminar el documento',
        {
          success: isDeleted.affected > 0,
        },
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
