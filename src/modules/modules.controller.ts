import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ModulesService } from './modules.service'
import { CreateModuleDTO } from './dto/create-module.dto'
import { Auth } from '../auth/auth-decorator'
import { BaseResponse } from '../shared/utils/base-response'

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Auth('admin')
  @Post()
  async create(@Body() body: CreateModuleDTO) {
    let response: BaseResponse
    const { moduleCreated, error } = await this.modulesService.create(body)

    if (error || !moduleCreated) {
      response = {
        message: 'Error creating module',
        error,
        statusCode: 500,
      }
      return response
    }

    response = {
      message: 'Module created',
      data: moduleCreated,
      statusCode: 201,
    }
  }

  @Auth('admin')
  @Get()
  async findAll() {
    return this.modulesService.findAll()
  }
}
