import { HttpException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { HttpCodes } from '../../shared/enums/http-codes'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new HttpException(
        'Error de autenticación. Por favor, inicie sesión.',
        HttpCodes.UNAUTHORIZED,
      )
    }

    return user
  }
}
