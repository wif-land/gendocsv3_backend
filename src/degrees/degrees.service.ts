import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DegreeEntity } from './entities/degree.entity'
import { Repository } from 'typeorm'
import { CreateDegreeDto } from './dto/create-degree.dto'
import { UpdateDegreeDto } from './dto/update-degree.dto'
import { DegreeAlreadyExist } from './errors/degree-already-exists'
import { DegreeBadRequestError } from './errors/degree-bad-request'
import { DegreeNotFoundError } from './errors/degree-not-found'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class DegreesService {
  constructor(
    @InjectRepository(DegreeEntity)
    private readonly degreeRepository: Repository<DegreeEntity>,
  ) {}

  async create(createDegreeDto: CreateDegreeDto) {
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

    return new ApiResponseDto('Título creado correctamente', newDegree)
  }

  async findAll() {
    const degrees = await this.degreeRepository.find()

    return new ApiResponseDto('Lista de títulos', degrees)
  }

  async findOne(id: number) {
    const degree = await this.degreeRepository.findOneBy({ id })

    if (!degree) {
      throw new DegreeNotFoundError(`El título con id ${id} no existe`)
    }

    return new ApiResponseDto('Detalle del título', degree)
  }

  async update(id: number, updateDegreeDto: UpdateDegreeDto) {
    const degree = await this.degreeRepository.preload({
      id,
      ...updateDegreeDto,
    })

    if (!degree) {
      throw new DegreeNotFoundError(`El título con id ${id} no existe`)
    }

    const degreeUpdated = await this.degreeRepository.save(degree)

    return new ApiResponseDto('Título actualizado correctamente', degreeUpdated)
  }
}
