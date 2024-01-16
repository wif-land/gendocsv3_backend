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
import { Auth } from '../auth/decorators/auth-decorator'
import { CareersService } from './careers.service'
import { CreateCareerDto } from './dto/create-career.dto'
@ApiTags('Careers')
@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Auth('ADMIN')
  @Post()
  async create(@Body() data: CreateCareerDto) {
    return await this.careersService.create(data)
  }

  @Auth('ADMIN')
  @Get()
  async findAll() {
    return await this.careersService.findAll()
  }

  @Auth('ADMIN')
  @Put()
  async update(
    @Query('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateCareerDto>,
  ) {
    return await this.careersService.update(id, data)
  }
}
