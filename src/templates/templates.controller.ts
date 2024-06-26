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
import { TemplatesService } from './templates.service'
import { CreateTemplateDto } from './dto/create-template.dto'
import { UpdateTemplateDto } from './dto/update-template.dto'
import { MigrateTemplatesToNewProcessDto } from './dto/migrate-templates-to-new-process.dto'

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return await this.templatesService.create(createTemplateDto)
  }

  @Patch('migrate')
  async migrateTemplatesToNewProcess(
    @Body() migrateTemplatesToNewProcessDto: MigrateTemplatesToNewProcessDto,
  ) {
    return await this.templatesService.migrateTemplatesToNewProcess(
      migrateTemplatesToNewProcessDto,
    )
  }

  @Get()
  async findAll() {
    return await this.templatesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.templatesService.findOne(id)
  }

  @Get('process/:id')
  async findByProcessId(@Param('id', ParseIntPipe) id: number) {
    return await this.templatesService.findByProcessId(id)
  }

  @Get('process/:processId/:field')
  async findByProcessAndField(
    @Param('processId', ParseIntPipe) processId: number,
    @Param('field') field: string,
  ) {
    return await this.templatesService.findByProcessAndField(processId, field)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return await this.templatesService.update(id, updateTemplateDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.templatesService.remove(id)
  }
}
