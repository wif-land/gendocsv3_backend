import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.forgotPassword(body.email)

    return new ApiResponseDto(
      `Se ha enviado un correo a ${body.email} para recuperar tu contraseña. Revisa tu bandeja de entrada o spam.`,
      null,
    )
  }

  @Post('new-password')
  async newPassword(
    @Body() body: { email: string; password: string; token: string },
  ) {
    return this.authService.newPassword(body.email, body.password, body.token)
  }

  @Post('resend-activation-email')
  async resendActivationEmail(@Body() body: { email: string }) {
    await this.authService.resendActivationEmail(body.email)

    return new ApiResponseDto(
      `Se ha enviado un correo a ${body.email} para activar tu cuenta. Revisa tu bandeja de entrada o spam.`,
      null,
    )
  }
}
