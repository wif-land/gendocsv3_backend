import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { DocumentsService } from './services/documents.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { ApiTags } from '@nestjs/swagger'
import { PaginationV2Dto } from '../shared/dtos/paginationv2.dto'
import { DocumentRecopilationService } from './services/document-recopilation.service'

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly documentRecopilationService: DocumentRecopilationService,
  ) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return await this.documentsService.create(createDocumentDto)
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationV2Dto) {
    return await this.documentsService.findAll(paginationDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.documentsService.findOne(+id)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.documentsService.remove(+id)
  }

  @Post('create-recopilation/:id')
  async createRecopilation(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.documentRecopilationService.generateRecopilationDocument(
        id,
      )
    } catch (error) {
      console.error(error)
    }
  }

  @Post('create-recopilation/content/:id')
  async createRecopilationByTemplate(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.documentRecopilationService.generateRecopilationDocuments(
        id,
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  @Post('create-recopilation/merge/:id')
  async mergeRecopilation(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.documentRecopilationService.mergeDocuments(id)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}
