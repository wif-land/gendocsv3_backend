import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthUser } from './dto/auth-user.dto'

interface Payload {
  sub: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  outlookEmail: string
  googleEmail: string
  iat: string
  roles: string[]
  isActive: boolean
  accessModulesIds: number[]
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  async validate(payload: Payload): Promise<AuthUser> {
    return {
      id: payload.sub,
      outlookEmail: payload.outlookEmail,
      googleEmail: payload.googleEmail,
      firstName: payload.firstName,
      firstLastName: payload.firstLastName,
      secondName: payload.secondName,
      secondLastName: payload.secondLastName,
      roles: payload.roles,
      isActive: payload.isActive,
      accessModulesIds: payload.accessModulesIds,
    }
  }
}
