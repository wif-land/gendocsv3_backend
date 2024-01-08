import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Module } from './entities/modules.entity'
import { CreateModuleDTO } from './dto/create-module.dto'
import { GcpService } from '../gcp/gcp.service'

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,

    private gcpService: GcpService,
  ) {}

  async create(module: CreateModuleDTO): Promise<Module> {
    try {
      const findModule = await this.moduleRepository.findOne({
        where: {
          code: module.code,
        },
      })

      if (findModule) {
        throw new HttpException('Module already exists', HttpStatus.CONFLICT)
      }

      return await this.moduleRepository.create(module).save()
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(): Promise<Module[]> {
    try {
      const modules = await this.moduleRepository.find()

      if (!modules) {
        throw new HttpException('Modules not found', HttpStatus.NOT_FOUND)
      }

      return modules
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async setFolders() {
    try {
      const modules = await this.moduleRepository.find()

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

          await this.moduleRepository.save(module)
        }
      }
    } catch (e) {
      new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
