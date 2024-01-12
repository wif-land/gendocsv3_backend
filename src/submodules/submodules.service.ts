import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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

  async create(createSubmoduleDto: CreateSubmoduleDto): Promise<Submodule> {
    try {
      const submodule = this.SubmodulesRepository.create(createSubmoduleDto)

      if (!submodule) {
        throw new HttpException('Submodule not created', HttpStatus.CONFLICT)
      }

      return await this.SubmodulesRepository.save(submodule)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(): Promise<Submodule[]> {
    try {
      const submodules = await this.SubmodulesRepository.find()

      if (!submodules) {
        throw new HttpException('Submodules not found', HttpStatus.NOT_FOUND)
      }

      return submodules
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<Submodule> {
    try {
      const submodule = await this.SubmodulesRepository.findOne({
        where: {
          id,
        },
      })

      if (!submodule) {
        throw new HttpException('Submodule not found', HttpStatus.NOT_FOUND)
      }

      return submodule
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const submodule = await this.SubmodulesRepository.findOne({
        where: {
          id,
        },
      })

      if (!submodule) {
        throw new HttpException('Submodule not found', HttpStatus.NOT_FOUND)
      }

      await this.SubmodulesRepository.remove(submodule)

      return true
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
