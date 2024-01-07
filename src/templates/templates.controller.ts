import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { CreateTemplateDto } from './dto/create-template.dto'
import { UpdateTemplateDto } from './dto/update-template.dto'

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return await this.templatesService.create(createTemplateDto)
  }

  @Get()
  async findAll() {
    return await this.templatesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.templatesService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return await this.templatesService.update(id, updateTemplateDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.templatesService.remove(id)
  }
}
