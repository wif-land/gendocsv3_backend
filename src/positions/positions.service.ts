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
import { PaginationDto } from '../shared/dtos/pagination.dto'

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

      const savedPosition = await this.positionRepository.save(position)

      if (!savedPosition) {
        throw new BadRequestException('Position not created')
      }

      const detailedPosition = await this.positionRepository.findOne({
        where: { id: savedPosition.id },
        relations: ['functionary'],
      })

      return detailedPosition
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = paginationDto

    try {
      const positions = await this.positionRepository.find({
        order: {
          id: 'ASC',
        },
        take: limit,
        skip: offset,
      })

      if (!positions) {
        throw new NotFoundException('Positions not found')
      }

      const count = await this.positionRepository.count()

      return {
        count,
        positions,
      }
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

  async findByField(field: string, paginationDTO: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = paginationDTO

    const queryBuilder = this.positionRepository.createQueryBuilder('positions')

    const positions = await queryBuilder
      .leftJoinAndSelect('positions.functionary', 'functionary')
      .where(
        `UPPER(positions.variable) like :field 
        or UPPER(positions.name) like :field `,
        { field: `%${field.toUpperCase()}%` },
      )
      .orderBy('positions.id', 'ASC')
      .take(limit)
      .skip(offset)
      .getMany()

    const count = await queryBuilder.getCount()

    if (!positions || !count) {
      throw new NotFoundException('Position not found')
    }

    return {
      count,
      positions,
    }
  }

  async update(
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    try {
      const position = await this.positionRepository.preload({
        ...updatePositionDto,
        functionary: { id: updatePositionDto.functionaryId },
        id,
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
