import { Controller, Delete, Post, Body, Patch } from '@nestjs/common'
import { UserAccessModulesService } from './users-access-modules.service'
import { CreateUserAccessModuleDto } from './dto/create-user-access-module.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('users-access-modules')
@Controller('users-access-modules')
export class UserAccessModulesController {
  constructor(
    private readonly userAccessModulesService: UserAccessModulesService,
  ) {}

  @Post()
  async create(@Body() createUserAccessModuleDto: CreateUserAccessModuleDto) {
    return await this.userAccessModulesService.create(createUserAccessModuleDto)
  }

  @Patch()
  async update(@Body() createUserAccessModuleDto: CreateUserAccessModuleDto) {
    return await this.userAccessModulesService.update(createUserAccessModuleDto)
  }

  @Delete()
  async remove(@Body() data: { userId: number; moduleId: number }) {
    return await this.userAccessModulesService.remove(
      data.userId,
      data.moduleId,
    )
  }

  @Delete('all-from-user')
  async removeAllFromUser(@Body() data: { userId: string }) {
    return await this.userAccessModulesService.removeByUserId(data.userId)
  }
}
