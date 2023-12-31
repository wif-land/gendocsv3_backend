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

  async create(module: CreateModuleDTO): Promise<Module> {
    return await this.moduleRepository.create(module).save()
  }

  async findAll(): Promise<Module[]> {
    return await this.moduleRepository.find()
  }
}
