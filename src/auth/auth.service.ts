import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { User } from '../users/users.entity'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'
import { Module } from '../modules/modules.entity'

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

    const accessModulesIds = user.accessModules.map(
      (module: Module) => module.id,
    )

    const payload = {
      firstName: user.firstName,
      firstLastName: user.firstLastName,
      secondName: user.secondName,
      secondLastName: user.secondLastName,
      outlookEmail: user.outlookEmail,
      googleEmail: user.googleEmail,
      sub: user.id,
      roles: user.roles,
      accessModulesIds,
      isActive: user.isActive,
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
