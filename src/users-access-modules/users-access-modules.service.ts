import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserAccessModule } from './entities/user-access-module.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateUserAccessModuleDto } from './dto/create-user-access-module.dto'
import { ModuleEntity } from '../modules/entities/modules.entity'

@Injectable()
export class UserAccessModulesService {
  constructor(
    @InjectRepository(UserAccessModule)
    private userAccessModulesRepository: Repository<UserAccessModule>,

    private dataSource: DataSource,
  ) {}

  async create(createUserAccessModuleDto: CreateUserAccessModuleDto) {
    try {
      const { userId, modulesIds } = createUserAccessModuleDto

      const userAccessModules: UserAccessModule[] = []
      const modules: ModuleEntity[] = []

      for (const moduleId of modulesIds) {
        const userAccessModuleCreated = this.userAccessModulesRepository.create(
          {
            userId,
            moduleId,
          },
        )

        if (!userAccessModuleCreated) {
          throw new HttpException(
            'UserAccessModule not created',
            HttpStatus.CONFLICT,
          )
        }

        const userAccessModule = await this.userAccessModulesRepository.save(
          userAccessModuleCreated,
        )

        const module = await this.dataSource
          .createQueryBuilder()
          .select('module')
          .from(ModuleEntity, 'module')
          .where('module.id = :moduleId', { moduleId })
          .getOne()

        if (!module) {
          throw new HttpException(
            'Module to asign not found',
            HttpStatus.NOT_FOUND,
          )
        }

        modules.push(module)
        userAccessModules.push(userAccessModule)
      }

      return {
        userAccessModules,
        modules,
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(createUserAccessModuleDto: CreateUserAccessModuleDto) {
    const { userId, modulesIds } = createUserAccessModuleDto
    const modules: ModuleEntity[] = []

    const userAccessModules: UserAccessModule[] = []
    try {
      const user = await this.dataSource
        .createQueryBuilder()
        .select('user')
        .from('users', 'user')
        .where('user.id = :userId', { userId })
        .getOne()

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

      await this.userAccessModulesRepository.delete({
        userId,
      })

      for (const moduleId of modulesIds) {
        const userAccessModuleCreated = this.userAccessModulesRepository.create(
          {
            userId,
            moduleId,
          },
        )

        if (!userAccessModuleCreated) {
          throw new HttpException(
            'UserAccessModule not created',
            HttpStatus.CONFLICT,
          )
        }

        const userAccessModule = await this.userAccessModulesRepository.save(
          userAccessModuleCreated,
        )

        const module = await this.dataSource
          .createQueryBuilder()
          .select('module')
          .from(ModuleEntity, 'module')
          .where('module.id = :moduleId', { moduleId })
          .getOne()

        if (!module) {
          throw new HttpException(
            'Module to asign not found',
            HttpStatus.NOT_FOUND,
          )
        }

        modules.push(module)

        userAccessModules.push(userAccessModule)
      }

      return {
        userAccessModules,
        modules,
      }
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const userAccessModules = await this.userAccessModulesRepository.find()

      if (!userAccessModules) {
        throw new HttpException(
          'UserAccessModules not found',
          HttpStatus.NOT_FOUND,
        )
      }

      return userAccessModules
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findModulesByUserId(userId: string) {
    try {
      const userAccessModules = await this.dataSource
        .createQueryBuilder()
        .select('module')
        .from(ModuleEntity, 'module')
        .innerJoin('users_access_modules', 'uam', 'uam.module_id = module.id')
        .where('uam.user_id = :userId', { userId })
        .getMany()

      if (!userAccessModules) {
        throw new HttpException(
          'UserAccessModules not found',
          HttpStatus.NOT_FOUND,
        )
      }

      return userAccessModules
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(userId: number, moduleId: number): Promise<boolean> {
    try {
      const userAccessModule = await this.userAccessModulesRepository.findOne({
        where: {
          userId,
          moduleId,
        },
      })

      if (!userAccessModule) {
        throw new HttpException(
          'UserAccessModule not found',
          HttpStatus.NOT_FOUND,
        )
      }

      await this.userAccessModulesRepository.remove(userAccessModule)

      return true
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeByUserId(userId: string) {
    try {
      const qb = this.dataSource.createQueryBuilder()
      return await qb
        .delete()
        .from(UserAccessModule)
        .where('userId = :userId', { userId })
        .execute()
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
