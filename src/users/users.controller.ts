import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/auth-decorator'
import { CreateUserDTO } from './dto/create-user.dto'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Auth()
  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto)
  }
}
