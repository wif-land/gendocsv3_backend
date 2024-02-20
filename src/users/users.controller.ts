import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDTO } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { PaginationDto } from '../shared/dtos/pagination.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.create(createUserDto)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDTO>,
  ) {
    return await this.userService.update(id, updateUserDto)
  }

  // @Auth('ADMIN')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id)
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.userService.findAll(paginationDto)
  }
}
