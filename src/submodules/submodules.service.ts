import { Injectable } from '@nestjs/common'
import { CreateSubmoduleDto } from './dto/create-submodule.dto'
import { Submodule } from './entities/submodule.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class SubmodulesService {
  constructor(
    @InjectRepository(Submodule)
    private SubmodulesRepository: Repository<Submodule>,
  ) {}

  async create(createSubmoduleDto: CreateSubmoduleDto) {
    let error = undefined
    let submodule
    try {
      submodule = await this.SubmodulesRepository.create(
        createSubmoduleDto,
      ).save()
    } catch (e) {
      error = e
    }
    return {
      submodule,
      error,
    }
  }

  async findAll() {
    return await this.SubmodulesRepository.find()
  }

  async findOne(id: string) {
    return await this.SubmodulesRepository.findOne({
      where: {
        id,
      },
    })
  }

  async remove(id: string) {
    return await this.SubmodulesRepository.delete({
      id,
    })
  }
}
