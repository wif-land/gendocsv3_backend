import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ModuleEntity } from './entities/modules.entity'
import { CreateModuleDTO } from './dto/create-module.dto'
import { GcpService } from '../gcp/gcp.service'
import { YearModuleService } from '../year-module/year-module.service'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(ModuleEntity)
    private moduleRepository: Repository<ModuleEntity>,

    private readonly gcpService: GcpService,
    private readonly yearModuleService: YearModuleService,
  ) {}

  async create(module: CreateModuleDTO) {
    try {
      const findModule = await this.moduleRepository.findOne({
        where: {
          code: module.code,
        },
      })

      if (findModule) {
        throw new HttpException('Module already exists', HttpStatus.CONFLICT)
      }

      const newModule = await this.moduleRepository.create(module).save()

      return new ApiResponseDto('Módulo creado exitosamente', newModule)
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const modules = await this.moduleRepository.find({
        where: {
          isActive: true,
        },
      })

      if (!modules) {
        throw new HttpException('Modules not found', HttpStatus.NOT_FOUND)
      }

      return new ApiResponseDto('Módulos encontrados exitosamente', modules)
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async setFolders() {
    try {
      const modules = await this.moduleRepository.find({
        where: {
          hasDocuments: true,
          isActive: true,
        },
      })

      if (!modules) {
        throw new HttpException('Modules not found', HttpStatus.NOT_FOUND)
      }

      let folderId

      for (const module of modules) {
        folderId = await this.gcpService.createFolder(module.name)

        if (module.hasDocuments) {
          if (!folderId) {
            throw new HttpException(
              'Error creating folder',
              HttpStatus.INTERNAL_SERVER_ERROR,
            )
          }

          module.driveId = folderId

          const auxModule = await this.moduleRepository.save(module)

          if (!auxModule) {
            throw new HttpException(
              'Error saving module',
              HttpStatus.INTERNAL_SERVER_ERROR,
            )
          }

          await this.yearModuleService.create({
            year: 2023,
            module: auxModule,
          })
        }
      }

      return new ApiResponseDto(
        'Carpetas creadas exitosamente para los módulos con documentos',
        {
          success: true,
        },
      )
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
