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
  async findAll(@Query('moduleId', ParseIntPipe) moduleId?: number) {
    return this.councilsService.findAll(moduleId)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.councilsService.findOne(+id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouncilDto: UpdateCouncilDto,
  ) {
    return this.councilsService.update(+id, updateCouncilDto)
  }
}
