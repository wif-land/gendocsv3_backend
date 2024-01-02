import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserAccessModule } from './entities/user-access-module.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateUserAccessModuleDto } from './dto/create-user-access-module.dto'

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
        userAccessModules.push(userAccessModule)
      }
    } catch (e) {
      error = e
    }
    return {
      userAccessModules,
      error,
    }
  }

  async update(createUserAccessModuleDto: CreateUserAccessModuleDto) {
    const { userId, modulesIds } = createUserAccessModuleDto

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
        userAccessModules.push(userAccessModule)
      }
    } catch (e) {
      error = e
    }
    return {
      userAccessModules,
      error,
    }
  }

  async findAll() {
    return await this.userAccessModulesRepository.find()
  }

  async remove(userId: number, moduleId: number) {
    return await this.userAccessModulesRepository.delete({
      userId,
      moduleId,
    })
  }

  async removeByUserId(userId: number) {
    const qb = this.dataSource.createQueryBuilder()
    return await qb
      .delete()
      .from(UserAccessModule)
      .where('userId = :userId', { userId })
      .execute()
  }
}
