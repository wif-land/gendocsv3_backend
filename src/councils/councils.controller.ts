import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  create(@Body() createCouncilDto: CreateCouncilDto) {
    return this.councilsService.create(createCouncilDto)
  }

  @Auth('ADMIN')
  @ApiResponse({ isArray: true, type: CouncilEntity })
  @Get()
  findAll() {
    return this.councilsService.findAll()
  }

  @Auth('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.councilsService.findOne(+id)
  }

  @Auth('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCouncilDto: Partial<CreateCouncilDto>,
  ) {
    return this.councilsService.update(+id, updateCouncilDto)
  }

  @Auth('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.councilsService.remove(+id)
  }
}
