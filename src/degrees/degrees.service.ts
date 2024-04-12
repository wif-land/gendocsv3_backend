import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DegreeEntity } from './entities/degree.entity'
import { Repository } from 'typeorm'
import { CreateDegreeDto } from './dto/create-degree.dto'
import { UpdateDegreeDto } from './dto/update-degree.dto'
import { DegreeAlreadyExist } from './errors/degree-already-exists'
import { DegreeBadRequestError } from './errors/degree-bad-request'
import { DegreeNotFoundError } from './errors/degree-not-found'
import { ApiResponse } from '../shared/interfaces/response.interface'

@Injectable()
export class DegreesService {
  constructor(
    @InjectRepository(DegreeEntity)
    private readonly degreeRepository: Repository<DegreeEntity>,
  ) {}

  async create(
    createDegreeDto: CreateDegreeDto,
  ): Promise<ApiResponse<DegreeEntity>> {
    if (
      this.degreeRepository.findOneBy({
        abbreviation: createDegreeDto.abbreviation,
      })
    ) {
      throw new DegreeAlreadyExist(
        `El título con abreviatura ${createDegreeDto.abbreviation} ya existe`,
      )
    }

    const degree = this.degreeRepository.create(createDegreeDto)

    if (!degree) {
      throw new DegreeBadRequestError('Los datos del título son incorrectos')
    }

    const newDegree = await this.degreeRepository.save(degree)

    return {
      message: 'Título creado correctamente',
      data: newDegree,
    }
  }

  async findAll(): Promise<ApiResponse<DegreeEntity[]>> {
    const degrees = await this.degreeRepository.find()

    return {
      message: 'Lista de títulos',
      data: degrees,
    }
  }

  async findOne(id: number): Promise<ApiResponse<DegreeEntity>> {
    const degree = await this.degreeRepository.findOneBy({ id })

    if (!degree) {
      throw new DegreeNotFoundError(`El título con id ${id} no existe`)
    }

    return {
      message: 'Detalle del título',
      data: degree,
    }
  }

  async update(
    id: number,
    updateDegreeDto: UpdateDegreeDto,
  ): Promise<ApiResponse<DegreeEntity>> {
    const degree = await this.degreeRepository.preload({
      id,
      ...updateDegreeDto,
    })

    if (!degree) {
      throw new DegreeNotFoundError(`El título con id ${id} no existe`)
    }

    const degreeUpdated = await this.degreeRepository.save(degree)

    return {
      message: 'Título actualizado correctamente',
      data: degreeUpdated,
    }
  }
}
