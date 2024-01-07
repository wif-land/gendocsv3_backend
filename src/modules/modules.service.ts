import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Module } from './entities/modules.entity'
import { CreateModuleDTO } from './dto/create-module.dto'

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
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
}
