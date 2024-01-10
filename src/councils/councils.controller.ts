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
import { Auth } from '../auth/decorators/auth-decorator'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CouncilEntity } from './entities/council.entity'

@ApiTags('Councils')
@Controller('councils')
export class CouncilsController {
  constructor(private readonly councilsService: CouncilsService) {}

  @Auth('ADMIN')
  @ApiResponse({ type: CouncilEntity })
  @Post()
  async create(@Body() createCouncilDto: CreateCouncilDto) {
    return this.councilsService.create(createCouncilDto)
  }

  @Auth('ADMIN')
  @ApiResponse({ isArray: true, type: CouncilEntity })
  @Get()
  async findAll(@Query('moduleId') moduleId?: string) {
    return this.councilsService.findAll(moduleId)
  }

  @Auth('ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.councilsService.findOne(+id)
  }

  @Auth('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCouncilDto: Partial<CreateCouncilDto>,
  ) {
    return this.councilsService.update(+id, updateCouncilDto)
  }
}
