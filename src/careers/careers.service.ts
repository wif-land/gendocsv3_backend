import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateCareerDto } from './dto/create-career.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Career } from './entites/careers.entity'

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
  ) {}

  async create(data: CreateCareerDto) {
    try {
      const career = this.careerRepository.create(data)

      if (!career) {
        throw new HttpException('Career not created', HttpStatus.BAD_REQUEST)
      }

      return await this.careerRepository.save(career)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, data: Partial<CreateCareerDto>) {
    try {
      const career = await this.careerRepository.update(id, data)

      if (!career) {
        throw new HttpException('Career not found', HttpStatus.NOT_FOUND)
      }

      const careerUpdated = await this.careerRepository.update(id, data)

      if (!careerUpdated) {
        throw new HttpException('Career not updated', HttpStatus.BAD_REQUEST)
      }

      return careerUpdated
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
