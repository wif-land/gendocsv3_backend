import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth-decorator'
import { CreateUserDTO } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { BaseResponseEntity } from '../shared/utils/base-response'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    const { user, error } = await this.userService.create(createUserDto)

    if (error || !user) {
      return new BaseResponseEntity({
        message: 'Error creating user',
        error,
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'User created',
      data: user,
      statusCode: 201,
    })
  }

  @Put()
  async update(
    @Query('id') id: number,
    @Body() updateUserDto: Partial<CreateUserDTO>,
  ) {
    const { accessToken, error, user } = await this.userService.update(
      id,
      updateUserDto,
    )

    if (error || !user) {
      return new BaseResponseEntity({
        message: 'Error updating user',
        error,
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'User updated',
      data: { accessToken, user },
      statusCode: 200,
    })
  }

  @Auth('ADMIN')
  @Delete()
  async delete(@Query('id') id: number) {
    return await this.userService.delete(id)
  }

  @Get()
  async findAll() {
    return await this.userService.findAll()
  }
}
