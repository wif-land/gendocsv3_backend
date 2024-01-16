import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreatePositionDto } from './dto/create-position.dto'
import { UpdatePositionDto } from './dto/update-position.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Position } from './entities/position.entity'

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    try {
      const position = this.positionRepository.create({
        ...createPositionDto,
        functionary: { id: createPositionDto.functionaryId },
      })

      if (!position) {
        throw new BadRequestException('Position not created')
      }

      return await this.positionRepository.save(position)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(): Promise<Position[]> {
    try {
      const positions = await this.positionRepository.find({
        order: {
          id: 'ASC',
        },
      })

      if (!positions) {
        throw new NotFoundException('Positions not found')
      }

      return positions
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<Position> {
    try {
      const position = await this.positionRepository.findOneBy({ id })

      if (!position) {
        throw new NotFoundException('Position not found')
      }

      return position
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    try {
      const position = await this.positionRepository.preload({
        id,
        ...updatePositionDto,
      })

      if (!position) {
        throw new NotFoundException('Position not found')
      }

      return await this.positionRepository.save(position)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.positionRepository.delete({ id })
      return true
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
