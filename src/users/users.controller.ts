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
import { Auth } from '../auth/decorators/auth.decorator'
import { RolesType } from '../shared/constants/roles'
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Auth(RolesType.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.create(createUserDto)
  }

  @Auth(RolesType.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDTO>,
  ) {
    return await this.userService.update(id, updateUserDto)
  }

  @Auth(RolesType.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id)
  }

  @Auth(RolesType.ADMIN)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.userService.findAll(paginationDto)
  }

  @Auth(RolesType.ADMIN)
  @ApiResponse({ isArray: true, type: UserEntity })
  @Get(`filter`)
  async findByFilters(@Query() filters: UserFiltersDto) {
    return await this.userService.findByFilters(filters)
  }
}
