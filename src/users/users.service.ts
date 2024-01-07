import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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

    private readonly userAccessModulesService: UserAccessModulesService,

    private readonly dataSource: DataSource,
  ) {}

  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          outlookEmail: email,
          isActive: true,
        },
      })

      if (!user) {
        throw new HttpException(
          'No se encontro el usuario',
          HttpStatus.NOT_FOUND,
        )
      }

      return user
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(user: CreateUserDTO) {
    try {
      const password = await this.generateSaltPassword(user.password)

      if (!password) {
        throw new HttpException(
          'No se pudo crear el usuario',
          HttpStatus.CONFLICT,
        )
      }

      const userEntity = await this.userRepository.create({
        ...user,
        accessModules: [],
        password,
      })

      if (!userEntity) {
        throw new HttpException(
          'No se pudo crear el usuario',
          HttpStatus.CONFLICT,
        )
      }

      let userSaved = await this.userRepository.save(userEntity)

      const { modules } = await this.userAccessModulesService.create({
        userId: userSaved.id,
        modulesIds: user.accessModules,
      })

      if (modules.length === 0) {
        throw new HttpException(
          'No se pudo crear asignar los modulos al usuario',
          HttpStatus.CONFLICT,
        )
      }

      userEntity.accessModules = modules

      userSaved = await this.userRepository.save(userEntity)

      if (!userSaved) {
        throw new HttpException(
          'No se pudo crear el usuario',
          HttpStatus.CONFLICT,
        )
      }

      return userSaved
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, user: Partial<CreateUserDTO>) {
    try {
      let userToUpdate = user
      let password = ''
      const hasNewPassword = user.password !== undefined
      const hasAccessModules = !!user.accessModules

      if (hasAccessModules) {
        const { modules } = await this.userAccessModulesService.update({
          userId: id,
          modulesIds: user.accessModules,
        })

        if (modules.length === 0) {
          throw new HttpException(
            'No se pudo actualizar los modulos del usuario',
            HttpStatus.CONFLICT,
          )
        }
      }

      const userGetted = await this.userRepository.findOne({
        where: {
          id,
        },
      })

      if (!userGetted) {
        throw new HttpException(
          'No se encontro el usuario',
          HttpStatus.NOT_FOUND,
        )
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

      if (!userUpdated) {
        throw new HttpException(
          'No se encontro el usuario',
          HttpStatus.NOT_FOUND,
        )
      }

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
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async delete(id: number): Promise<boolean> {
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
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

      if (!users) {
        throw new HttpException('Usuarios no encontrados', HttpStatus.NOT_FOUND)
      }

      return users
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private async generateSaltPassword(password: string): Promise<string> {
    const ROUNDS = 10
    const SALT = await genSalt(ROUNDS)

    return hash(password, SALT)
  }
}
