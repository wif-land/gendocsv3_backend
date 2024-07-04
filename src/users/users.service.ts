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
import { FilesService } from '../files/services/files.service'
import { RolesType } from '../auth/decorators/roles-decorator'
import { UsersGateway } from './users.gateway'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly filesService: FilesService,

    private readonly usersGateway: UsersGateway,
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
          'No se encontró el usuario',
          HttpStatus.NOT_FOUND,
        )
      }

      return new ApiResponseDto('Usuario encontrado', user)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(user: CreateUserDTO) {
    const alreadyExists = await this.userRepository.findOne({
      where: {
        outlookEmail: user.outlookEmail,
      },
    })

    if (alreadyExists) {
      throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT)
    }

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

    const { error, data: isShared } = await this.filesService.shareAsset(
      `${process.env.GOOGLE_DRIVE_SHARABLE_FOLDER_ID}`,
      userSaved.googleEmail,
      user.role === RolesType.READER ? 'reader' : 'writer',
    )

    if (error || !isShared) {
      userSaved.remove()

      throw new HttpException(
        'No se pudo otorgar permisos en Google Drive, verifique el correo de gmail del usuario',
        HttpStatus.CONFLICT,
      )
    }

    return new ApiResponseDto(
      'Usuario creado correctamente, tome en cuenta que la habilitación de permisos de documentos tardará 10-15 minutos en aplicarse',
      {
        ...userSaved,
        accessModules: userSaved.accessModules.map((module) => module.id),
      },
    )
  }

  async update(id: number, user: Partial<CreateUserDTO>) {
    try {
      let userToUpdate = user
      let password = ''
      const hasNewPassword = user.password !== undefined
      const hasAccessModules = !!user.accessModules
      const userFound = await this.userRepository.findOne({
        where: {
          id,
        },
      })

      if (!userFound) {
        throw new HttpException(
          'No se encontro el usuario',
          HttpStatus.NOT_FOUND,
        )
      }

      const currentUser = { ...userFound }
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

      if (user.googleEmail && user.googleEmail !== currentUser.googleEmail) {
        const { error, data: isShared } = await this.filesService.shareAsset(
          `${process.env.GOOGLE_DRIVE_SHARABLE_FOLDER_ID}`,
          user.googleEmail,
          userUpdated.role === RolesType.READER ? 'reader' : 'writer',
        )

        if (error || !isShared) {
          await this.userRepository.update({ id }, currentUser)

          throw new HttpException(
            'No se pudo otorgar permisos en Google Drive, verifique el correo de gmail del usuario',
            HttpStatus.CONFLICT,
          )
        }

        const { error: unsharedError, data: isUnshared } =
          await this.filesService.unshareAsset(
            `${process.env.GOOGLE_DRIVE_SHARABLE_FOLDER_ID}`,
            currentUser.googleEmail,
          )

        if (!isUnshared || unsharedError) {
          await this.userRepository.update({ id }, currentUser)

          throw new HttpException(
            'No se pudo revocar permisos en Google Drive, verifique el correo de gmail del usuario',
            HttpStatus.CONFLICT,
          )
        }
      }

      if (user.isActive !== undefined && user.isActive === false) {
        const { error, data: isUnshared } =
          await this.filesService.unshareAsset(
            `${process.env.GOOGLE_DRIVE_SHARABLE_FOLDER_ID}`,
            user.googleEmail,
          )

        if (error || !isUnshared) {
          await this.userRepository.update({ id }, currentUser)

          throw new HttpException(
            'No se pudo revocar permisos en Google Drive',
            HttpStatus.CONFLICT,
          )
        }
      }

      const payload = {
        sub: id,
        firstName: userUpdated.firstName,
        firstLastName: userUpdated.firstLastName,
        secondName: userUpdated.secondName,
        secondLastName: userUpdated.secondLastName,
        outlookEmail: userUpdated.outlookEmail,
        googleEmail: userUpdated.googleEmail,
        role: userUpdated.role,
        isActive: userUpdated.isActive,
        accessModules: userUpdated.accessModules,
      }

      if (hasAccessModules) {
        this.usersGateway.handleChangeAccessModules(
          userUpdated.accessModules.map((module) => module.id),
        )
      }

      return new ApiResponseDto(
        'Usuario actualizado, tome en cuenta que la habilitación de permisos de documentos tardará 10-15 minutos en aplicarse',
        {
          user: {
            ...userUpdated,
            accessModules: userUpdated.accessModules.map((module) => module.id),
          },
          accessToken: this.jwtService.sign(payload),
        },
      )
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    })

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }

    const { error, data: isUnshared } = await this.filesService.unshareAsset(
      `${process.env.GOOGLE_DRIVE_SHARABLE_FOLDER_ID}`,
      user.googleEmail,
    )

    if (error || !isUnshared) {
      throw new HttpException(
        'No se pudo revocar permisos en Google Drive',
        HttpStatus.CONFLICT,
      )
    }

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

  async updateRecoveryPasswordToken(email: string, token: string) {
    await this.userRepository.update(
      {
        outlookEmail: email,
      },
      {
        recoveryPasswordToken: token,
        recoveryPasswordTokenTries: () => 'recovery_password_token_tries + 1',
      },
    )
  }

  async newPassword(email: string, password: string, token: string) {
    const user = await this.userRepository.findOne({
      where: {
        outlookEmail: email,
        recoveryPasswordToken: token,
      },
    })

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }
    user.password = await this.generateSaltPassword(password)
    user.recoveryPasswordToken = null
    user.recoveryPasswordTokenTries = 0

    await this.userRepository.save(user)

    return new ApiResponseDto('Contraseña actualizada', null)
  }

  private async generateSaltPassword(password: string) {
    const ROUNDS = 10
    const SALT = await genSalt(ROUNDS)

    return hash(password, SALT)
  }
}
