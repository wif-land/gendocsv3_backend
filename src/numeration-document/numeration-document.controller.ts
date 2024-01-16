import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { NumerationDocumentService } from './numeration-document.service'
import { CreateNumerationDocumentDto } from './dto/create-numeration-document.dto'
import { UpdateNumerationDocumentDto } from './dto/update-numeration-document.dto'

@Controller('numeration-document')
export class NumerationDocumentController {
  constructor(
    private readonly numerationDocumentService: NumerationDocumentService,
  ) {}

  @Post()
  create(@Body() createNumerationDocumentDto: CreateNumerationDocumentDto) {
    return this.numerationDocumentService.create(createNumerationDocumentDto)
  }

  @Get()
  findAll() {
    return this.numerationDocumentService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.numerationDocumentService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNumerationDocumentDto: UpdateNumerationDocumentDto,
  ) {
    return this.numerationDocumentService.update(
      +id,
      updateNumerationDocumentDto,
    )
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.numerationDocumentService.remove(+id)
  }
}
