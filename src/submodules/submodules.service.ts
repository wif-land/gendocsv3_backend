import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateSubmoduleDto } from './dto/create-submodule.dto'
import { SubmoduleEntity } from './entities/submodule.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponse } from '../shared/interfaces/response.interface'

@Injectable()
export class SubmodulesService {
  constructor(
    @InjectRepository(SubmoduleEntity)
    private SubmodulesRepository: Repository<SubmoduleEntity>,
  ) {}

  async create(
    createSubmoduleDto: CreateSubmoduleDto,
  ): Promise<ApiResponse<SubmoduleEntity>> {
    try {
      const submodule = this.SubmodulesRepository.create(createSubmoduleDto)

      if (!submodule) {
        throw new HttpException('Submodule not created', HttpStatus.CONFLICT)
      }

      const newSubmodule = await this.SubmodulesRepository.save(submodule)

      return {
        message: 'Submodulo creado correctamente',
        data: newSubmodule,
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(): Promise<ApiResponse<SubmoduleEntity[]>> {
    try {
      const submodules = await this.SubmodulesRepository.find()

      if (!submodules) {
        throw new HttpException('Submodules not found', HttpStatus.NOT_FOUND)
      }

      return {
        message: 'Submodulos encontrados',
        data: submodules,
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<ApiResponse<SubmoduleEntity>> {
    try {
      const submodule = await this.SubmodulesRepository.findOne({
        where: {
          id,
        },
      })

      if (!submodule) {
        throw new HttpException('Submodule not found', HttpStatus.NOT_FOUND)
      }

      return {
        message: 'Submodulo encontrado',
        data: submodule,
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number): Promise<ApiResponse> {
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

      return {
        message: 'Submodulo eliminado correctamente',
        data: {
          success: true,
        },
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
