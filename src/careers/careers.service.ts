import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateCareerDto } from './dto/create-career.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { CareerEntity } from './entites/careers.entity'
import { PromiseApiResponse } from '../shared/interfaces/response.interface'

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(CareerEntity)
    private readonly careerRepository: Repository<CareerEntity>,
  ) {}

  async create(data: CreateCareerDto): PromiseApiResponse<CareerEntity> {
    try {
      if (data.isActive) {
        const existingCareer = await this.careerRepository.findOne({
          where: {
            coordinator: { id: data.coordinator },
            isActive: true,
          },
        })

        if (existingCareer) {
          throw new HttpException(
            'El coordinador ya se encuentra asignado a una carrera activa',
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

      return {
        message: 'Carrera creada con éxito',
        data: newCareer,
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async findAll(): PromiseApiResponse<CareerEntity[]> {
    try {
      const carrers = await this.careerRepository.find({
        order: {
          id: 'ASC',
        },
      })

      return {
        message: 'Carreras encontradas',
        data: carrers,
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async update(
    id: number,
    data: Partial<CreateCareerDto>,
  ): PromiseApiResponse<CareerEntity> {
    try {
      let coordinatorId: number
      if (data.coordinator === undefined) {
        coordinatorId = (await this.careerRepository.findOneBy({ id }))
          .coordinator.id
      }

      if (data !== undefined && data.isActive) {
        const existingCareer = await this.careerRepository.findOne({
          where: {
            coordinator: { id: data.coordinator || coordinatorId },
            isActive: true,
            id: Not(id),
          },
        })

        if (existingCareer) {
          throw new HttpException(
            'El coordinador ya se encuentra asignado a una carrera activa',
            HttpStatus.BAD_REQUEST,
          )
        }
      }

      const career = await this.careerRepository.preload({
        id,
        ...data,
        coordinator: { id: data.coordinator || coordinatorId },
      })

      if (!career) {
        throw new HttpException('Carrera no encontrada', HttpStatus.BAD_REQUEST)
      }

      const careerUpdated = await this.careerRepository.save(career)

      return {
        message: 'Carrera actualizada con éxito',
        data: careerUpdated,
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
