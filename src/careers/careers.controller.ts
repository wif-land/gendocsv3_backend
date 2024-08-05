import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { CareersService } from './careers.service'
import { CreateCareerDto } from './dto/create-career.dto'
import {
  AdminRoles,
  RolesThatCanQuery,
  RolesType,
} from '../shared/constants/roles'
import { UpdateCareerDto } from './dto/update-career.dto'

@ApiTags('Careers')
@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Auth(RolesType.ADMIN)
  @Post()
  async create(@Body() data: CreateCareerDto) {
    return await this.careersService.create(data)
  }

  @Auth(...RolesThatCanQuery)
  @Get()
  async findAll() {
    return await this.careersService.findAll()
  }

  @Auth(...AdminRoles)
  @Put()
  async update(
    @Query('id', ParseIntPipe) id: number,
    @Body() data: UpdateCareerDto,
  ) {
    return await this.careersService.update(id, data)
  }
}
