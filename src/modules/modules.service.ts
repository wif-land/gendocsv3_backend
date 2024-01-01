import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Module } from './modules.entity'
import { CreateModuleDTO } from './dto/create-module.dto'

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
  ) {}

  async create(module: CreateModuleDTO) {
    let moduleCreated: Module
    let error = undefined
    try {
      moduleCreated = await this.moduleRepository.create(module).save()
    } catch (e) {
      error = e
    }

    return { moduleCreated, error }
  }

  async findAll(): Promise<Module[]> {
    return await this.moduleRepository.find()
  }
}
