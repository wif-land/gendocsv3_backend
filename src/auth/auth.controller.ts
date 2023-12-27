import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto.email, loginDto.password)
  }
}
