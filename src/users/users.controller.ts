import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/auth-decorator'
import { CreateUserDTO } from './dto/create-user.dto'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Auth('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.create(createUserDto)
  }

  @Auth('admin', 'api')
  @Put()
  async update(
    @Query('id') id: number,
    @Body() updateUserDto: Partial<CreateUserDTO>,
  ): Promise<{ accessToken: string }> {
    return await this.userService.update(id, updateUserDto)
  }

  @Auth('admin')
  @Delete()
  async delete(@Query('id') id: number) {
    return await this.userService.delete(id)
  }

  @Auth('admin')
  @Get()
  async findAll() {
    return await this.userService.findAll()
  }
}
