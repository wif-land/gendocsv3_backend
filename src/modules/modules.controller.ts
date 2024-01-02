import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ModulesService } from './modules.service'
import { CreateModuleDTO } from './dto/create-module.dto'
import { Auth } from '../auth/auth-decorator'
import { BaseResponseEntity } from '../shared/utils/base-response'

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Auth('ADMIN')
  @Post()
  async create(@Body() body: CreateModuleDTO) {
    const { moduleCreated, error } = await this.modulesService.create(body)

    if (error || !moduleCreated) {
      return new BaseResponseEntity({
        message: 'Error creating module',
        error,
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'Module created',
      data: moduleCreated,
      statusCode: 201,
    })
  }

  @Auth('ADMIN')
  @Get()
  async findAll() {
    return this.modulesService.findAll()
  }
}
