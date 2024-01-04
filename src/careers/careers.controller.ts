import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth-decorator'
import { CareersService } from './careers.service'
import { CreateCareerDto } from './dto/create-career.dto'
import { BaseResponseEntity } from '../shared/utils/base-response'

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
    @Query('id') id: number,
    @Body() data: Partial<CreateCareerDto>,
  ) {
    const result = await this.careersService.update(id, data)

    return new BaseResponseEntity({
      message: 'Career updated',
      data: result,
      statusCode: 201,
    })
  }
}
