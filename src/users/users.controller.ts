import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth-decorator'
import { CreateUserDTO } from './dto/create-user.dto'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.create(createUserDto)
  }

  @Put()
  async update(
    @Query('id') id: number,
    @Body() updateUserDto: Partial<CreateUserDTO>,
  ) {
    return await this.userService.update(id, updateUserDto)
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
