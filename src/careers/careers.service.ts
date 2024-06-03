import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
    try {
      if (data.isActive) {
        const existingCareer = await this.careerRepository.findOne({
          where: {
            name: data.name,
            isActive: true,
          },
        })

        if (existingCareer) {
          throw new HttpException(
            'Ya existe una carrera activa con ese nombre',
            HttpStatus.BAD_REQUEST,
          )
        }
      }

      const career = this.careerRepository.create({
        ...data,
        coordinator: { id: data.coordinator },
      })

      const newCareer = await this.careerRepository.save(career)

      if (!newCareer) {
        throw new HttpException(
          'Error al crear la carrera',
          HttpStatus.BAD_REQUEST,
        )
      }

      return new ApiResponseDto('Carrera creada con éxito', newCareer)
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async findAll() {
    try {
      const carrers = await this.careerRepository.find({
        order: {
          id: 'ASC',
        },
      })

      return new ApiResponseDto('Carreras encontradas', carrers)
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async update(id: number, data: UpdateCareerDto) {
    try {
      if (data.name) {
        const existingCareer = await this.careerRepository.findOne({
          where: {
            id: Not(id),
            isActive: true,
            name: data.name,
          },
        })

        if (existingCareer) {
          throw new HttpException(
            'Ya existe una carrera activa con ese nombre',
            HttpStatus.BAD_REQUEST,
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
        throw new HttpException('Carrera no encontrada', HttpStatus.BAD_REQUEST)
      }

      return new ApiResponseDto('Carrera actualizada con éxito', careerUpdated)
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
