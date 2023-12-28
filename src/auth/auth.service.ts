import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { User } from '../users/users.entity'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.getByEmail(email)
    const validUser = this.validateUser(user, password)

    if (!validUser) {
      throw new UnauthorizedException(`AuthService:login ${email} ********`)
    }

    const payload = {
      username: `${user.firstName} ${user.firstLastName}`,
      sub: user.id,
      roles: user.roles,
      platformPermission: user.platformPermission,
    }

    return { accessToken: this.jwtService.sign(payload) }
  }

  private validateUser(user: User, passwordToVerify: string): boolean {
    return user && this.checkPassword(passwordToVerify, user.password)
  }

  private checkPassword(loginPassword: string, userPassword: string): boolean {
    return compareSync(loginPassword, userPassword)
  }
}
