import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateCareerDto } from './dto/create-career.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { CareerEntity } from './entites/careers.entity'
import { UpdateCareerDto } from './dto/update-carreer.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(CareerEntity)
    private readonly careerRepository: Repository<CareerEntity>,
  ) {}

  async create(data: CreateCareerDto) {
    if (data.isActive) {
      const existingCareer = await this.careerRepository.findOne({
        where: {
          name: data.name,
          isActive: true,
        },
      })

      if (existingCareer) {
        throw new BadRequestException(
          'Ya existe una carrera activa con ese nombre',
        )
      }
    }

    const career = this.careerRepository.create({
      ...data,
      coordinator: { id: data.coordinator },
    })

    const newCareer = await this.careerRepository.save(career)

    if (!newCareer) {
      throw new InternalServerErrorException('Error al crear la carrera')
    }

    return new ApiResponseDto('Carrera creada con éxito', newCareer)
  }

  async findAll() {
    const carrers = await this.careerRepository.find({
      order: {
        id: 'ASC',
      },
    })

    return new ApiResponseDto('Carreras encontradas', carrers)
  }

  async update(id: number, data: UpdateCareerDto) {
    if (data.name) {
      const existingCareer = await this.careerRepository.findOne({
        where: {
          id: Not(id),
          isActive: true,
          name: data.name,
        },
      })

      if (existingCareer) {
        throw new BadRequestException(
          'Ya existe una carrera activa con ese nombre',
        )
      }
    }

    const career = await this.careerRepository.preload({
      id,
      ...data,
      coordinator: { id: data.coordinator },
    })

    const careerUpdated = await this.careerRepository.save(career)

    if (!careerUpdated) {
      throw new InternalServerErrorException('Carrera no encontrada')
    }

    return new ApiResponseDto('Carrera actualizada con éxito', careerUpdated)
  }
}
