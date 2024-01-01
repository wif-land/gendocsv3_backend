import { Injectable } from '@nestjs/common'
import { CreateSubmodulesModuleDto } from './dto/create-submodules-module.dto'
import { UpdateSubmodulesModuleDto } from './dto/update-submodules-module.dto'
import { Repository } from 'typeorm'
import { SubmodulesModule } from './entities/submodules-module.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class SubmodulesModulesService {
  constructor(
    @InjectRepository(SubmodulesModule)
    private submodulesModulesRepository: Repository<SubmodulesModule>,
  ) {}

  async create(createSubmodulesModuleDto: CreateSubmodulesModuleDto) {
    const { moduleId, submoduleIds } = createSubmodulesModuleDto

    let error = undefined
    const submodulesModules: SubmodulesModule[] | undefined = undefined
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
      error = e
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
    const submodulesModules: SubmodulesModule[] | undefined = undefined
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
    return await this.submodulesModulesRepository.delete({
      moduleId,
    })
  }
}
