import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common'
import { FunctionariesService } from './functionaries.service'
import { CreateFunctionaryDto } from './dto/create-functionary.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { FunctionaryEntity } from './entities/functionary.entity'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { UpdateFunctionaryDto } from './dto/update-functionary.dto'
import { UpdateFunctionariesBulkItemDto } from './dto/update-functionaries-bulk.dto'

@ApiTags('Functionaries')
@Controller('functionaries')
export class FunctionariesController {
  constructor(private readonly functionariesService: FunctionariesService) {}

  @Patch(`bulk`)
  async createBulk(
    @Body() updateFunctionariesBulkDto: UpdateFunctionariesBulkItemDto[],
  ) {
    return await this.functionariesService.createBulk(
      updateFunctionariesBulkDto,
    )
  }

  @Post()
  async create(@Body() createFunctionaryDto: CreateFunctionaryDto) {
    return await this.functionariesService.create(createFunctionaryDto)
  }

  @ApiResponse({ isArray: true, type: FunctionaryEntity })
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.functionariesService.findAll(paginationDto)
  }

  @ApiResponse({ isArray: true, type: FunctionaryEntity })
  @Get(`:field`)
  async findByField(
    @Param('field') field: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.functionariesService.findByField(field, paginationDto)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFunctionaryDto: UpdateFunctionaryDto,
  ) {
    return await this.functionariesService.update(id, updateFunctionaryDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.functionariesService.remove(id)
  }
}
