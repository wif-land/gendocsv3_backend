import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
    try {
      const { moduleId, submoduleIds } = createSubmodulesModuleDto
      const submodulesModules: SubmodulesModule[] = []

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

        if (!submodulesModule) {
          throw new HttpException(
            'SubmodulesModule not created',
            HttpStatus.CONFLICT,
          )
        }
      }

      return submodulesModules
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const submodulesModules = await this.submodulesModulesRepository.find()

      if (!submodulesModules) {
        throw new HttpException(
          'SubmodulesModules not found',
          HttpStatus.NOT_FOUND,
        )
      }

      return submodulesModules
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(updateSubmodulesModuleDto: UpdateSubmodulesModuleDto) {
    try {
      const { moduleId, submoduleIds } = updateSubmodulesModuleDto

      const submodulesModules: SubmodulesModule[] = []
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

        if (!submodulesModule) {
          throw new HttpException(
            'SubmodulesModule not created',
            HttpStatus.CONFLICT,
          )
        }

        submodulesModules.push(submodulesModule)
      }

      return submodulesModules
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(moduleId: number, submoduleId: number): Promise<boolean> {
    try {
      const submodulesModule = await this.submodulesModulesRepository.findOne({
        where: {
          moduleId,
          submoduleId,
        },
      })

      if (!submodulesModule) {
        throw new HttpException(
          'SubmodulesModule not found',
          HttpStatus.NOT_FOUND,
        )
      }

      await this.submodulesModulesRepository.remove(submodulesModule)

      return true
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeAll(moduleId: number): Promise<boolean> {
    try {
      const qb = await this.dataSource.createQueryBuilder()

      await qb
        .delete()
        .from(SubmodulesModule)
        .where('module_id = :moduleId', { moduleId })
        .execute()

      return true
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
