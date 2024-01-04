import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { User } from './entities/users.entity'
import { CreateUserDTO } from './dto/create-user.dto'
import { genSalt, hash } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserAccessModulesService } from '../users-access-modules/users-access-modules.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,

    private readonly UserAccessModulesService: UserAccessModulesService,

    private readonly dataSource: DataSource,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: {
        outlookEmail: email,
        isActive: true,
      },
    })

    return result
  }

  async create(user: CreateUserDTO) {
    const password = await this.generateSaltPassword(user.password)

    let userCreated = undefined
    let error = undefined

    try {
      const userEntity = await this.userRepository.create({
        ...user,
        accessModules: [],
        password,
      })

      let userSaved = await this.userRepository.save(userEntity)

      const { modules, error } = await this.UserAccessModulesService.create({
        userId: userSaved.id,
        modulesIds: user.accessModules,
      })

      userEntity.accessModules = modules

      userSaved = await this.userRepository.save(userEntity)

      if (error) {
        throw new Error(error)
      }

      if (modules.length === 0) {
        throw new Error('No se pudo crear asignar los modulos al usuario')
      }

      userCreated = userSaved
    } catch (e) {
      error = e
    }

    return {
      user: userCreated,
      error,
    }
  }

  async update(id: string, user: Partial<CreateUserDTO>) {
    let userToUpdate = user
    let password = ''
    let error = undefined
    const hasNewPassword = user.password !== undefined

    try {
      const { modules } = await this.UserAccessModulesService.update({
        userId: id,
        modulesIds: user.accessModules,
      })

      if (modules.length === 0) {
        throw new Error('No se pudo actualizar los modulos del usuario')
      }

      if (hasNewPassword) {
        password = await this.generateSaltPassword(user.password)

        userToUpdate = {
          ...user,
          password,
        }
      }

      await this.userRepository.update(
        {
          id,
        },
        {
          ...userToUpdate,
          accessModules: undefined,
        },
      )

      const userUpdated = await this.userRepository.findOne({
        where: {
          id,
        },
      })

      const payload = {
        sub: id,
        firstName: user.firstName,
        firstLastName: user.firstLastName,
        secondName: user.secondName,
        secondLastName: user.secondLastName,
        outlookEmail: user.outlookEmail,
        googleEmail: user.googleEmail,
        roles: user.roles,
        isActive: user.isActive,
        accessModules: user.accessModules,
      }

      return { user: userUpdated, accessToken: this.jwtService.sign(payload) }
    } catch (e) {
      error = e
      return { error }
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.userRepository.update(
        {
          id,
        },
        {
          isActive: false,
        },
      )

      return true
    } catch (error) {
      return false
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        outlookEmail: true,
        googleEmail: true,
        firstName: true,
        firstLastName: true,
        secondName: true,
        secondLastName: true,
        roles: true,
        isActive: true,
      },
    })
  }

  private async generateSaltPassword(password: string): Promise<string> {
    const ROUNDS = 10
    const SALT = await genSalt(ROUNDS)

    return hash(password, SALT)
  }
}
