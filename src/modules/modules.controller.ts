import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ModulesService } from './modules.service'
import { CreateModuleDTO } from './dto/create-module.dto'
import { Auth } from '../auth/auth-decorator'

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Auth('admin')
  @Post()
  async create(@Body() body: CreateModuleDTO) {
    return this.modulesService.create(body)
  }
}
