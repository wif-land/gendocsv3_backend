import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ModulesService } from './modules.service'
import { CreateModuleDTO } from './dto/create-module.dto'
import { Auth } from '../auth/decorators/auth-decorator'
import { RolesType } from '../auth/decorators/roles-decorator'

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Auth(RolesType.ADMIN)
  @Post()
  async create(@Body() body: CreateModuleDTO) {
    return await this.modulesService.create(body)
  }

  @Get()
  async findAll() {
    return await this.modulesService.findAll()
  }

  @Get('set-folders')
  async setFolders() {
    return await this.modulesService.setFolders()
  }
}
