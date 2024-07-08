import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      Logger.error('Error de autenticación')

      throw new UnauthorizedException(
        'Error de autenticación. Por favor inicie sesión.',
      )
    }

    return user
  }
}
