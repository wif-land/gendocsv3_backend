import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { SubmodulesService } from './submodules.service'
import { CreateSubmoduleDto } from './dto/create-submodule.dto'
import { HttpCodes } from '../shared/enums/http-codes'
import { BaseResponseEntity } from '../shared/utils/base-response'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('submodules')
@Controller('submodules')
export class SubmodulesController {
  constructor(private readonly submodulesService: SubmodulesService) {}

  @Post()
  async create(@Body() createSubmoduleDto: CreateSubmoduleDto) {
    const { submodule, error } = await this.submodulesService.create(
      createSubmoduleDto,
    )

    if (error || !submodule) {
      return new BaseResponseEntity({
        message: 'Error creating submodule',
        error,
        statusCode: HttpCodes.INTERNAL_SERVER_ERROR,
      })
    }

    return new BaseResponseEntity({
      message: 'Submodule created',
      data: submodule,
      statusCode: HttpCodes.OK,
    })
  }

  @Get()
  findAll() {
    return this.submodulesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submodulesService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submodulesService.remove(+id)
  }
}
