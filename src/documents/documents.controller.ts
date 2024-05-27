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

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationV2Dto) {
    return this.documentsService.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(+id)
  }

  @Post('create-recopilation/:id')
  createRecopilation(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.documentsService.generateRecopilationDocument(id)
    } catch (error) {
      console.error(error)
    }
  }

  @Post('create-recopilation/content/:id')
  createRecopilationByTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.generateRecopilationContent(id)
  }
}
