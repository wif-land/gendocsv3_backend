import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateSubmodulesModuleDto } from './dto/create-submodule-module.dto'
import { UpdateSubmodulesModuleDto } from './dto/update-submodule-module.dto'
import { DataSource, Repository } from 'typeorm'
import { SubmoduleModuleEntity } from './entities/submodule-module.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class SubmodulesModulesService {
  constructor(
    @InjectRepository(SubmoduleModuleEntity)
    private submodulesModulesRepository: Repository<SubmoduleModuleEntity>,

    private dataSource: DataSource,
  ) {}

  async create(createSubmodulesModuleDto: CreateSubmodulesModuleDto) {
    try {
      const { moduleId, submoduleIds } = createSubmodulesModuleDto
      const submodulesModules: SubmoduleModuleEntity[] = []

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

      return new ApiResponseDto(
        'Submodulos creados correctamente',
        submodulesModules,
      )
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

      return new ApiResponseDto(
        'Submodulos encontrados correctamente',
        submodulesModules,
      )
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(updateSubmodulesModuleDto: UpdateSubmodulesModuleDto) {
    try {
      const { moduleId, submoduleIds } = updateSubmodulesModuleDto

      const submodulesModules: SubmoduleModuleEntity[] = []
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

      return new ApiResponseDto(
        'Submodulos actualizados correctamente',
        submodulesModules,
      )
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(moduleId: number, submoduleId: number) {
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

      return new ApiResponseDto('Submodulo eliminado correctamente', {
        success: true,
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeAll(moduleId: number) {
    try {
      const qb = await this.dataSource.createQueryBuilder()

      await qb
        .delete()
        .from(SubmoduleModuleEntity)
        .where('module_id = :moduleId', { moduleId })
        .execute()

      return new ApiResponseDto('Submodulos eliminados correctamente', {
        success: true,
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
