import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthUser } from './dto/auth-user.dto'

interface Payload {
  sub: string
  username: string
  outlookEmail: string
  emailGmail: string
  iat: string
  roles: string[]
  platformPermission: string[]
  isActive: boolean
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
      gmailEmail: payload.emailGmail,
      username: payload.username,
      roles: payload.roles,
      platformPermission: payload.platformPermission,
      isActive: payload.isActive,
    }
  }
}
