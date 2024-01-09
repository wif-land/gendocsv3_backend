import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { ProcessesService } from './processes.service'
import { CreateProcessDto } from './dto/create-process.dto'
import { UpdateProcessDto } from './dto/update-process.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Process } from './entities/process.entity'
import { ResponseProcessDto } from './dto/response-process.dto'

@ApiTags('Processes')
@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @Post()
  async create(@Body() createProcessDto: CreateProcessDto) {
    return await this.processesService.create(createProcessDto)
  }

  @ApiResponse({ isArray: true, type: ResponseProcessDto })
  @Get()
  async findAll() {
    return await this.processesService.findAll()
  }

  @ApiResponse({ isArray: true, type: ResponseProcessDto })
  @Get('get-processes')
  async getProcesses(@Param('module-code') moduleCode: string) {
    return await this.processesService.getProcessesByModuleCode(moduleCode)
  }

  @ApiResponse({ type: Process })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.processesService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProcessDto: UpdateProcessDto,
  ) {
    return await this.processesService.update(id, updateProcessDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.processesService.remove(id)
  }
}
