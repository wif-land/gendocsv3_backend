import { Injectable } from '@nestjs/common'
import { CreateSubmodulesModuleDto } from './dto/create-submodule-module.dto'
import { UpdateSubmodulesModuleDto } from './dto/update-submodule-module.dto'
import { DataSource, Repository } from 'typeorm'
import { SubmodulesModule } from './entities/submodule-module.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class SubmodulesModulesService {
  constructor(
    @InjectRepository(SubmodulesModule)
    private submodulesModulesRepository: Repository<SubmodulesModule>,

    private dataSource: DataSource,
  ) {}

  async create(createSubmodulesModuleDto: CreateSubmodulesModuleDto) {
    const { moduleId, submoduleIds } = createSubmodulesModuleDto

    let error = undefined
    const submodulesModules: SubmodulesModule[] = []
    try {
      for (const submoduleId of submoduleIds) {
        const submodulesModuleCreated = this.submodulesModulesRepository.create(
          {
            moduleId,
            submoduleId,
          },
        )
        const submodulesModule = await this.submodulesModulesRepository.save(
          submodulesModuleCreated,
        )
        submodulesModules.push(submodulesModule)
      }
    } catch (e) {
      error = e.message
    }
    return {
      submodulesModules,
      error,
    }
  }

  async findAll() {
    return await this.submodulesModulesRepository.find()
  }

  async update(updateSubmodulesModuleDto: UpdateSubmodulesModuleDto) {
    const { moduleId, submoduleIds } = updateSubmodulesModuleDto

    let error = undefined
    const submodulesModules: SubmodulesModule[] = []
    try {
      await this.submodulesModulesRepository.delete({
        moduleId,
      })

      for (const submoduleId of submoduleIds) {
        const submodulesModuleCreated = this.submodulesModulesRepository.create(
          {
            moduleId,
            submoduleId,
          },
        )
        const submodulesModule = await this.submodulesModulesRepository.save(
          submodulesModuleCreated,
        )
        submodulesModules.push(submodulesModule)
      }
    } catch (e) {
      error = e
    }
    return {
      submodulesModules,
      error,
    }
  }

  async remove(moduleId: number, submoduleId: number) {
    return await this.submodulesModulesRepository.delete({
      moduleId,
      submoduleId,
    })
  }

  async removeAll(moduleId: number) {
    // console.log(moduleId)
    try {
      const qb = await this.dataSource.createQueryBuilder()

      return await qb
        .delete()
        .from(SubmodulesModule)
        .where('module_id = :moduleId', { moduleId })
        .execute()
    } catch (e) {
      // console.log(e)
      return false
    }
  }
}
