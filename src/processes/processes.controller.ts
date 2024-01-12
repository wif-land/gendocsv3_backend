import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { ProcessesService } from './processes.service'
import { CreateProcessDto } from './dto/create-process.dto'
import { UpdateProcessDto } from './dto/update-process.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { ResponseProcessDto } from './dto/response-process.dto'

@ApiTags('Processes')
@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @Post()
  async create(@Body() createProcessDto: CreateProcessDto) {
    return await this.processesService.create(createProcessDto)
  }

  @ApiResponse({ type: ResponseProcessDto })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.processesService.findOne(id)
  }

  @ApiResponse({ isArray: true, type: ResponseProcessDto })
  @Get()
  async getProcesses(@Query('moduleId') moduleId: number) {
    return await this.processesService.getProcessesByModuleId(moduleId)
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
