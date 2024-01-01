import { Controller, Get, Param, Delete } from '@nestjs/common'
import { UserAccessModulesService } from './user-access-modules.service'

@Controller('user-access-modules')
export class UserAccessModulesController {
  constructor(
    private readonly userAccessModulesService: UserAccessModulesService,
  ) {}

  @Get()
  findAll() {
    return this.userAccessModulesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAccessModulesService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAccessModulesService.remove(+id)
  }
}
