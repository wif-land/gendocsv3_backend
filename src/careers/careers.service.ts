import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateCareerDto } from './dto/create-career.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Career } from './entites/careers.entity'

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
  ) {}

  async create(data: CreateCareerDto) {
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
            'Coordinator is already assigned to an active career',
            HttpStatus.BAD_REQUEST,
          )
        }
      }

      const career = this.careerRepository.create({
        ...data,
        coordinator: { id: data.coordinator },
      })

      if (!career) {
        throw new HttpException('Career not created', HttpStatus.BAD_REQUEST)
      }

      return await this.careerRepository.save(career)
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

      if (!carrers) {
        throw new HttpException('Careers not found', HttpStatus.NOT_FOUND)
      }

      return carrers
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async update(id: number, data: Partial<CreateCareerDto>) {
    try {
      if (data.isActive) {
        const existingCareer = await this.careerRepository.findOne({
          where: {
            coordinator: { id: data.coordinator },
            isActive: true,
            id: Not(id),
          },
        })

        if (existingCareer) {
          throw new HttpException(
            'Coordinator is already assigned to another active career',
            HttpStatus.BAD_REQUEST,
          )
        }
      }

      const career = await this.careerRepository.preload({
        id,
        ...data,
        coordinator: { id: data.coordinator },
      })

      if (!career) {
        throw new HttpException('Career not found', HttpStatus.BAD_REQUEST)
      }

      return await this.careerRepository.save(career)
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
