import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Documents')
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(+id)
  }
}
