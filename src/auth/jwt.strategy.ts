import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthUser } from './dto/auth-user.dto'

interface Payload {
  sub: string
  username: string
  email: string
  emailGmail: string
  iat: string
  roles: string[]
  platformPermission: string[]
  status?: boolean
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret'),
    })
  }

  async validate(payload: Payload): Promise<AuthUser> {
    return {
      email: payload.email,
      emailGmail: payload.emailGmail,
      id: payload.sub,
      name: payload.username,
      roles: payload.roles,
      platformPermission: payload.platformPermission,
      status: payload.status,
    }
  }
}
