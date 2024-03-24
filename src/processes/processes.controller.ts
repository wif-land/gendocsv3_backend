import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { ProcessesService } from './processes.service'
import { CreateProcessDto } from './dto/create-process.dto'
import { UpdateProcessDto } from './dto/update-process.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { ResponseProcessDto } from './dto/response-process.dto'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { UpdateProcessBulkItemDto } from './dto/update-processes-bulk.dto'

@ApiTags('Processes')
@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @Patch('bulk')
  async updateBulk(@Body() updateProcessesBulkDto: UpdateProcessBulkItemDto[]) {
    return await this.processesService.updateBulk(updateProcessesBulkDto)
  }

  @Post()
  async create(@Body() createProcessDto: CreateProcessDto) {
    return await this.processesService.create(createProcessDto)
  }

  @Get(':field')
  async findByField(
    @Param('field') field: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.processesService.findByField(field, paginationDto)
  }

  // @ApiResponse({ type: ResponseProcessDto })
  // @Get(':id')
  // async findOne(@Param('id', ParseIntPipe) id: number) {
  //   return await this.processesService.findOne(id)
  // }

  @ApiResponse({ isArray: true, type: ResponseProcessDto })
  @Get()
  async getProcesses(@Query() paginationDto: PaginationDto) {
    return await this.processesService.getProcessesByModuleId(paginationDto)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProcessDto: UpdateProcessDto,
  ) {
    return await this.processesService.update(id, updateProcessDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.processesService.remove(id)
  }
}
