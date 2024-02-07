import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { CouncilsService } from './councils.service'
import { CreateCouncilDto } from './dto/create-council.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CouncilEntity } from './entities/council.entity'
import { UpdateCouncilDto } from './dto/update-council.dto'
import { UpdateCouncilBulkItemDto } from './dto/update-councils-bulk.dto'
import { PaginationDto } from '../shared/dtos/pagination.dto'

@ApiTags('Councils')
@Controller('councils')
export class CouncilsController {
  constructor(private readonly councilsService: CouncilsService) {}

  @Patch('bulk')
  async updateBulk(@Body() updateCouncilsBulkDto: UpdateCouncilBulkItemDto[]) {
    return this.councilsService.updateBulk(updateCouncilsBulkDto)
  }

  @ApiResponse({ type: CouncilEntity })
  @Post()
  async create(@Body() createCouncilDto: CreateCouncilDto) {
    return this.councilsService.create(createCouncilDto)
  }

  @ApiResponse({ isArray: true, type: CouncilEntity })
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.councilsService.findAll(paginationDto)
  }

  @Get('count')
  async countCouncils(@Query('moduleId', ParseIntPipe) moduleId?: number) {
    return this.councilsService.count(moduleId)
  }

  @Get(':term')
  async findByTerm(@Param('term') term: string) {
    return this.councilsService.findByTerm(term)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouncilDto: UpdateCouncilDto,
  ) {
    return this.councilsService.update(+id, updateCouncilDto)
  }
}
