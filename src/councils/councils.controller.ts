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
import { CouncilFiltersDto } from './dto/council-filters.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { Auth } from '../auth/decorators/auth-decorator'
import { RolesType } from '../auth/decorators/roles-decorator'

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
    return new ApiResponseDto(
      'Consejo creado exitosamente',
      await this.councilsService.create(createCouncilDto),
    )
  }

  @Auth(RolesType.ADMIN, RolesType.WRITER, RolesType.API, RolesType.READER)
  @ApiResponse({ isArray: true, type: CouncilEntity })
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.councilsService.findAllAndCount(paginationDto)
  }

  @Auth(RolesType.ADMIN, RolesType.WRITER, RolesType.API, RolesType.READER)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new ApiResponseDto(
      'Consejo encontrado',
      await this.councilsService.getById(id),
    )
  }

  @Auth(RolesType.ADMIN, RolesType.WRITER, RolesType.API, RolesType.READER)
  @Get('filter')
  async findByFilters(@Query() filters: CouncilFiltersDto) {
    return this.councilsService.findByFilters(filters)
  }

  @Auth(RolesType.ADMIN, RolesType.WRITER, RolesType.API)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouncilDto: UpdateCouncilDto,
  ) {
    return new ApiResponseDto(
      'Consejo actualizado exitosamente',
      await this.councilsService.update(id, updateCouncilDto),
    )
  }

  @Auth(RolesType.ADMIN, RolesType.WRITER, RolesType.API)
  @Post(':id/notify-members')
  async notifyMembers(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: number[],
  ) {
    return new ApiResponseDto(
      'Notificación enviada exitosamente',
      await this.councilsService.notifyMembers(id, body),
    )
  }
}
