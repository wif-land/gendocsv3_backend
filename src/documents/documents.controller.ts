import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { CreateDocumentDto } from './dto/create-document.dto'

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto)
  }

  @Get()
  findAll() {
    return this.documentsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.documentsService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.documentsService.remove(+id)
  }
}
