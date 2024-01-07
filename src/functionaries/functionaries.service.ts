import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateFunctionaryDto } from './dto/create-functionary.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Functionary } from './entities/functionary.entity'

@Injectable()
export class FunctionariesService {
  constructor(
    @InjectRepository(Functionary)
    private readonly functionaryRepository: Repository<Functionary>,
  ) {}

  async create(
    createFunctionaryDto: CreateFunctionaryDto,
  ): Promise<Functionary> {
    try {
      const functionary =
        this.functionaryRepository.create(createFunctionaryDto)

      if (!functionary) {
        throw new BadRequestException('Functionary not created')
      }

      return await this.functionaryRepository.save(functionary)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(): Promise<Functionary[]> {
    try {
      const functionaries = await this.functionaryRepository.find({
        order: {
          id: 'ASC',
        },
      })

      if (!functionaries) {
        throw new NotFoundException('Functionaries not found')
      }

      return functionaries
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: string): Promise<Functionary> {
    try {
      const functionary = await this.functionaryRepository.findOneBy({ id })

      if (!functionary) {
        throw new NotFoundException('Functionary not found')
      }

      return functionary
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(
    id: string,
    updateFunctionaryDto: Partial<CreateFunctionaryDto>,
  ): Promise<Functionary> {
    try {
      const functionary = await this.functionaryRepository.preload({
        id,
        ...updateFunctionaryDto,
      })

      if (!functionary) {
        throw new NotFoundException('Functionary not found')
      }

      return await this.functionaryRepository.save(functionary)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const functionary = await this.findOne(id)

      if (!functionary) {
        throw new NotFoundException('Functionary not found')
      }

      functionary.isActive = false

      await this.functionaryRepository.save(functionary)

      return true
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
