import { Injectable } from '@nestjs/common'
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
    return this.careerRepository.create(data).save()
  }

  async findAll() {
    return this.careerRepository.find({
      order: {
        id: 'ASC',
      },
    })
  }

  async update(id: number, data: Partial<CreateCareerDto>) {
    return this.careerRepository.update(id, data)
  }
}
