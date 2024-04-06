import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { PositionsService } from './positions.service'
import { CreatePositionDto } from './dto/create-position.dto'
import { UpdatePositionDto } from './dto/update-position.dto'
import { PaginationDto } from '../shared/dtos/pagination.dto'

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async create(@Body() createPositionDto: CreatePositionDto) {
    return await this.positionsService.create(createPositionDto)
  }

  @Delete('/delete/bulk')
  async removeBulk(@Body() ids: number[]) {
    return await this.positionsService.removeBulk(ids)
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.positionsService.findAll(paginationDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.positionsService.findOne(id)
  }

  @Get('filter/:field')
  async findByField(
    @Param('field') field: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.positionsService.findByField(field, paginationDto)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return await this.positionsService.update(id, updatePositionDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.positionsService.remove(id)
  }
}
