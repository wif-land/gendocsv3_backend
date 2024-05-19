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
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDTO } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { UserEntity } from './entities/users.entity'
import { UserFiltersDto } from './dto/user-filters.dto'

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

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id)
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.userService.findAll(paginationDto)
  }

  @ApiResponse({ isArray: true, type: UserEntity })
  @Get(`filter`)
  async findByFilters(@Query() filters: UserFiltersDto) {
    return await this.userService.findByFilters(filters)
  }
}
