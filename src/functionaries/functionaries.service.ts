import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateFunctionaryDto } from './dto/create-functionary.dto'
import { UpdateFunctionaryDto } from './dto/update-functionary.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Functionary } from './entities/functionary.entity'

@Injectable()
export class FunctionariesService {
  constructor(
    @InjectRepository(Functionary)
    private readonly functionaryRepository: Repository<Functionary>,
  ) {}

  async create(createFunctionaryDto: CreateFunctionaryDto) {
    try {
      const functionary =
        this.functionaryRepository.create(createFunctionaryDto)
      return await this.functionaryRepository.save(functionary)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(): Promise<Functionary[]> {
    return await this.functionaryRepository.find()
  }

  async findOne(id: string): Promise<Functionary> {
    const functionary = await this.functionaryRepository.findOneBy({ id })

    if (!functionary) {
      throw new BadRequestException('Functionary not found')
    }

    return functionary
  }

  async update(
    id: string,
    updateFunctionaryDto: UpdateFunctionaryDto,
  ): Promise<Functionary> {
    const functionary = await this.functionaryRepository.preload({
      id,
      ...updateFunctionaryDto,
    })

    if (!functionary) {
      throw new BadRequestException('Functionary not found')
    }

    return await this.functionaryRepository.save(functionary)
  }

  async remove(id: string): Promise<boolean> {
    const functionary = await this.findOne(id)

    functionary.isActive = false

    await this.functionaryRepository.save(functionary)

    return true
  }
}
