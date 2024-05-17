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
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,

    private readonly userAccessModulesService: UserAccessModulesService,

    private readonly dataSource: DataSource,
  ) {}

  async getByEmail(email: string) {
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

      return new ApiResponseDto('Usuario encontrado', user)
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

      const { data } = await this.userAccessModulesService.create({
        userId: userSaved.id,
        modulesIds: user.accessModules,
      })

      if (data.modules.length === 0) {
        throw new HttpException(
          'No se pudo crear asignar los modulos al usuario',
          HttpStatus.CONFLICT,
        )
      }

      userEntity.accessModules = data.modules

      userSaved = await this.userRepository.save(userEntity)

      if (!userSaved) {
        throw new HttpException(
          'No se pudo crear el usuario',
          HttpStatus.CONFLICT,
        )
      }

      return new ApiResponseDto('Usuario creado correctamente', {
        ...userSaved,
        accessModules: userSaved.accessModules.map((module) => module.id),
      })
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
        const result = await this.userAccessModulesService.update({
          userId: id,
          modulesIds: user.accessModules,
        })

        if (result.data.modules.length === 0) {
          throw new HttpException(
            'No se pudo actualizar los modulos del usuario',
            HttpStatus.CONFLICT,
          )
        }
        userToUpdate.accessModules = result.data.modules.map(
          (module) => module.id,
        )
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

      return new ApiResponseDto('Usuario actualizado', {
        user: {
          ...userUpdated,
          accessModules: userUpdated.accessModules.map((module) => module.id),
        },
        accessToken: this.jwtService.sign(payload),
      })
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async delete(id: number) {
    try {
      await this.userRepository.update(
        {
          id,
        },
        {
          isActive: false,
        },
      )

      return new ApiResponseDto('Usuario eliminado', {
        success: true,
      })
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(paginationDto: PaginationDto) {
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

      return new ApiResponseDto('Usuarios encontrados', {
        count,
        users: usersFound,
      })
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByFilters(filters: UserFiltersDto) {
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

    return new ApiResponseDto('Usuarios encontrados', {
      count,
      users,
    })
  }

  private async generateSaltPassword(password: string) {
    const ROUNDS = 10
    const SALT = await genSalt(ROUNDS)

    return hash(password, SALT)
  }
}
