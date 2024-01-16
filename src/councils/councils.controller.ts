import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common'
import { CouncilsService } from './councils.service'
import { CreateCouncilDto } from './dto/create-council.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CouncilEntity } from './entities/council.entity'

@ApiTags('Councils')
@Controller('councils')
export class CouncilsController {
  constructor(private readonly councilsService: CouncilsService) {}

  @ApiResponse({ type: CouncilEntity })
  @Post()
  async create(@Body() createCouncilDto: CreateCouncilDto) {
    return this.councilsService.create(createCouncilDto)
  }

  @ApiResponse({ isArray: true, type: CouncilEntity })
  @Get()
  async findAll(@Query('moduleId') moduleId?: number) {
    return this.councilsService.findAll(moduleId)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.councilsService.findOne(+id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCouncilDto: Partial<CreateCouncilDto>,
  ) {
    return this.councilsService.update(+id, updateCouncilDto)
  }
}
