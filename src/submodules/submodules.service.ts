import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateSubmoduleDto } from './dto/create-submodule.dto'
import { SubmoduleEntity } from './entities/submodule.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class SubmodulesService {
  constructor(
    @InjectRepository(SubmoduleEntity)
    private SubmodulesRepository: Repository<SubmoduleEntity>,
  ) {}

  async create(createSubmoduleDto: CreateSubmoduleDto) {
    try {
      const submodule = this.SubmodulesRepository.create(createSubmoduleDto)

      if (!submodule) {
        throw new HttpException('Submodule not created', HttpStatus.CONFLICT)
      }

      const newSubmodule = await this.SubmodulesRepository.save(submodule)

      return new ApiResponseDto('Submodulo creado correctamente', newSubmodule)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const submodules = await this.SubmodulesRepository.find()

      if (!submodules) {
        throw new HttpException('Submodules not found', HttpStatus.NOT_FOUND)
      }

      return new ApiResponseDto('Submodulos encontrados', submodules)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number) {
    try {
      const submodule = await this.SubmodulesRepository.findOne({
        where: {
          id,
        },
      })

      if (!submodule) {
        throw new HttpException('Submodule not found', HttpStatus.NOT_FOUND)
      }

      return new ApiResponseDto('Submodulo encontrado', submodule)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number) {
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

      return new ApiResponseDto('Submodulo eliminado correctamente', {
        success: true,
      })
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
