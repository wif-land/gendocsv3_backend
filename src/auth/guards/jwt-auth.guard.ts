import { HttpException, Injectable, Logger } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { HttpCodes } from '../../shared/enums/http-codes'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name)
  handleRequest(err, user) {
    if (err || !user) {
      this.logger.error('Error de autenticación', err, user)

      throw new HttpException(
        'Error de autorización. Por favor inicie sesión.',
        HttpCodes.UNAUTHORIZED,
      )
    }

    return user
  }
}
