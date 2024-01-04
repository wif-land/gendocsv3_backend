import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserAccessModule } from './entities/user-access-module.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateUserAccessModuleDto } from './dto/create-user-access-module.dto'
import { Module } from '../modules/entities/modules.entity'

@Injectable()
export class UserAccessModulesService {
  constructor(
    @InjectRepository(UserAccessModule)
    private userAccessModulesRepository: Repository<UserAccessModule>,

    private dataSource: DataSource,
  ) {}

  async create(createUserAccessModuleDto: CreateUserAccessModuleDto) {
    const { userId, modulesIds } = createUserAccessModuleDto

    let error = undefined
    const userAccessModules: UserAccessModule[] = []
    const modules: Module[] = []

    try {
      for (const moduleId of modulesIds) {
        const userAccessModuleCreated = this.userAccessModulesRepository.create(
          {
            userId,
            moduleId,
          },
        )
        const userAccessModule = await this.userAccessModulesRepository.save(
          userAccessModuleCreated,
        )

        const module = await this.dataSource
          .createQueryBuilder()
          .select('module')
          .from(Module, 'module')
          .where('module.id = :moduleId', { moduleId })
          .getOne()

        modules.push(module)
        userAccessModules.push(userAccessModule)
      }
    } catch (e) {
      error = e
    }
    return {
      userAccessModules,
      modules,
      error,
    }
  }

  async update(createUserAccessModuleDto: CreateUserAccessModuleDto) {
    const { userId, modulesIds } = createUserAccessModuleDto
    const modules: Module[] = []

    let error = undefined
    const userAccessModules: UserAccessModule[] = []
    try {
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
        const userAccessModule = await this.userAccessModulesRepository.save(
          userAccessModuleCreated,
        )

        const module = await this.dataSource
          .createQueryBuilder()
          .select('module')
          .from(Module, 'module')
          .where('module.id = :moduleId', { moduleId })
          .getOne()

        modules.push(module)

        userAccessModules.push(userAccessModule)
      }
    } catch (e) {
      error = e
    }
    return {
      userAccessModules,
      modules,
      error,
    }
  }

  async findAll() {
    return await this.userAccessModulesRepository.find()
  }

  async findModulesByUserId(userId: string) {
    const qb = this.dataSource.createQueryBuilder()

    return await qb
      .select('module')
      .from(Module, 'module')
      .innerJoin('users_access_modules', 'uam', 'uam.module_id = module.id')
      .where('uam.user_id = :userId', { userId })
      .getMany()
  }

  async remove(userId: string, moduleId: number) {
    return await this.userAccessModulesRepository.delete({
      userId,
      moduleId,
    })
  }

  async removeByUserId(userId: string) {
    const qb = this.dataSource.createQueryBuilder()
    return await qb
      .delete()
      .from(UserAccessModule)
      .where('userId = :userId', { userId })
      .execute()
  }
}
