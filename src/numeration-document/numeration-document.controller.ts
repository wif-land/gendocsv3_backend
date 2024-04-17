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
import { NumerationDocumentService } from './numeration-document.service'
import { CreateNumerationDocumentDto } from './dto/create-numeration-document.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('NumerationDocument')
@Controller('numeration-document')
export class NumerationDocumentController {
  constructor(
    private readonly numerationDocumentService: NumerationDocumentService,
  ) {}

  @Post()
  create(@Body() createNumerationDocumentDto: CreateNumerationDocumentDto) {
    return this.numerationDocumentService.create(createNumerationDocumentDto)
  }

  @Get('by-council')
  async findByCouncil(@Query('councilId', ParseIntPipe) id: number) {
    return await this.numerationDocumentService.getNumerationByCouncil(id)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.numerationDocumentService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.numerationDocumentService.remove(id)
  }
}
