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
import { PositionEntity } from './entities/position.entity'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
    @InjectRepository(FunctionaryEntity)
    private readonly functionaryRepository: Repository<FunctionaryEntity>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<PositionEntity> {
    try {
      const functionaryId = await this.functionaryRepository.findOne({
        where: { dni: createPositionDto.functionary },
      })

      const position = this.positionRepository.create({
        ...createPositionDto,
        functionary: { id: functionaryId.id },
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

  async findOne(id: number): Promise<PositionEntity> {
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
  ): Promise<PositionEntity> {
    try {
      const functionarieId = await this.functionaryRepository.findOne({
        where: { dni: updatePositionDto.functionary },
      })

      const position = await this.positionRepository.preload({
        ...updatePositionDto,
        id,
        functionary: { id: functionarieId.id },
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

  async removeBulk(ids: number[]): Promise<boolean> {
    try {
      await this.positionRepository.delete(ids)
      return true
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
