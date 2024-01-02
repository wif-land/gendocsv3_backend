import { Controller, Delete, Post, Body, Patch } from '@nestjs/common'
import { UserAccessModulesService } from './user-access-modules.service'
import { CreateUserAccessModuleDto } from './dto/create-user-access-module.dto'
import { BaseResponseEntity } from '../shared/utils/base-response'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('user-access-modules')
@Controller('user-access-modules')
export class UserAccessModulesController {
  constructor(
    private readonly userAccessModulesService: UserAccessModulesService,
  ) {}

  @Post()
  async create(@Body() createUserAccessModuleDto: CreateUserAccessModuleDto) {
    const { userAccessModules, error } =
      await this.userAccessModulesService.create(createUserAccessModuleDto)

    if (error || !userAccessModules) {
      return new BaseResponseEntity({
        message: 'Error creating userAccessModule',
        error,
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'UserAccessModule created',
      data: userAccessModules,
      statusCode: 201,
    })
  }

  @Patch()
  async update(@Body() createUserAccessModuleDto: CreateUserAccessModuleDto) {
    const { userAccessModules, error } =
      await this.userAccessModulesService.update(createUserAccessModuleDto)

    if (error || !userAccessModules) {
      return new BaseResponseEntity({
        message: 'Error updating userAccessModule',
        error,
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'UserAccessModule updated',
      data: userAccessModules,
      statusCode: 200,
    })
  }

  @Delete()
  async remove(@Body() data: { userId: number; moduleId: number }) {
    const removed = await this.userAccessModulesService.remove(
      data.userId,
      data.moduleId,
    )

    if (!removed) {
      return new BaseResponseEntity({
        message: 'Error removing userAccessModule',
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'UserAccessModule removed',
      statusCode: 200,
    })
  }

  @Delete('all-from-user')
  async removeAllFromUser(@Body() data: { userId: number }) {
    const removed = await this.userAccessModulesService.removeByUserId(
      data.userId,
    )

    if (!removed) {
      return new BaseResponseEntity({
        message: 'Error removing userAccessModule',
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'UserAccessModule removed',
      statusCode: 200,
    })
  }
}
