import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common'
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
    @Param('id') id: number,
    @Body() updateUserDto: Partial<CreateUserDTO>,
  ) {
    return await this.userService.update(id, updateUserDto)
  }

  @Auth('admin')
  @Delete()
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id)
  }
}
