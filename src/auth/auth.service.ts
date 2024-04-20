import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { UserEntity } from '../users/entities/users.entity'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcrypt'
import { ModuleEntity } from '../modules/entities/modules.entity'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const { data: user } = await this.usersService.getByEmail(email)
    const validUser = this.validateUser(user, password)

    if (!validUser) {
      throw new UnauthorizedException(`AuthService:login ${email} ********`)
    }

    const accessModules = user.accessModules.map(
      (module: ModuleEntity) => module.id,
    )

    const payload = {
      firstName: user.firstName,
      firstLastName: user.firstLastName,
      secondName: user.secondName,
      secondLastName: user.secondLastName,
      outlookEmail: user.outlookEmail,
      googleEmail: user.googleEmail,
      sub: user.id,
      role: user.role,
      accessModules,
      isActive: user.isActive,
    }

    return new ApiResponseDto(
      'Usuario autenticado',
      this.jwtService.sign(payload),
    )
  }

  private validateUser(user: UserEntity, passwordToVerify: string) {
    return user && this.checkPassword(passwordToVerify, user.password)
  }

  private checkPassword(loginPassword: string, userPassword: string): boolean {
    return compareSync(loginPassword, userPassword)
  }
}
