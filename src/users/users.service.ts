import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UserEntity } from './entities/users.entity'
import { CreateUserDTO } from './dto/create-user.dto'
import { genSalt, hash } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserAccessModulesService } from '../users-access-modules/users-access-modules.service'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { UserFiltersDto } from './dto/user-filters.dto'
import { ApiResponse } from '../shared/interfaces/response.interface'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,

    private readonly userAccessModulesService: UserAccessModulesService,

    private readonly dataSource: DataSource,
  ) {}

  async getByEmail(email: string): Promise<ApiResponse<UserEntity>> {
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

      return {
        message: 'Usuario encontrado',
        data: user,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(user: CreateUserDTO): Promise<ApiResponse<unknown>> {
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

      return {
        message: 'Usuario creado correctamente',
        data: {
          ...userSaved,
          accessModules: userSaved.accessModules.map((module) => module.id),
        },
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(
    id: number,
    user: Partial<CreateUserDTO>,
  ): Promise<ApiResponse<unknown>> {
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
        userToUpdate.accessModules = modules.map((module) => module.id)
      }

      const userGetted = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['accessModules'],
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
        relations: ['accessModules'],
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
        role: user.role,
        isActive: user.isActive,
        accessModules: user.accessModules,
      }

      return {
        message: 'Usuario actualizado',
        data: {
          user: {
            ...userUpdated,
            accessModules: userUpdated.accessModules.map((module) => module.id),
          },
          accessToken: this.jwtService.sign(payload),
        },
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async delete(id: number): Promise<ApiResponse> {
    try {
      await this.userRepository.update(
        {
          id,
        },
        {
          isActive: false,
        },
      )

      return {
        message: 'Usuario eliminado',
        data: {
          success: true,
        },
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ApiResponse<unknown>> {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = paginationDto
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
          role: true,
          isActive: true,
        },
        order: {
          id: 'ASC',
        },
        take: limit,
        skip: offset,
      })

      const usersFound = users.map((user) => ({
        ...user,
        accessModules: user.accessModules.map((module) => module.id),
      }))

      if (!users) {
        throw new HttpException('Usuarios no encontrados', HttpStatus.NOT_FOUND)
      }

      const count = await this.userRepository.count()

      return {
        message: 'Usuarios encontrados',
        data: { count, users: usersFound },
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByFilters(filters: UserFiltersDto): Promise<
    ApiResponse<{
      count: number
      users: UserEntity[]
    }>
  > {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = filters

    const qb = this.userRepository.createQueryBuilder('users')

    qb.where(
      '( (:state :: BOOLEAN) IS NULL OR users.isActive = (:state :: BOOLEAN) )',
      {
        state: filters.state,
      },
    ).andWhere(
      "( (:term :: VARCHAR ) IS NULL OR CONCAT_WS(' ', users.firstName, users.secondName, users.firstLastName, users.secondLastName) ILIKE :term)",
      {
        term: filters.field && `%${filters.field.trim()}%`,
      },
    )

    const count = await qb.getCount()
    if (count === 0) {
      throw new NotFoundException('User not found')
    }

    const users = await qb
      .orderBy('users.id', 'ASC')
      .take(limit)
      .skip(offset)
      .getMany()

    return {
      message: 'Usuarios encontrados',
      data: {
        count,
        users,
      },
    }
  }

  private async generateSaltPassword(password: string): Promise<string> {
    const ROUNDS = 10
    const SALT = await genSalt(ROUNDS)

    return hash(password, SALT)
  }
}
