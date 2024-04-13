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
import { ApiResponse } from '../shared/interfaces/response.interface'

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
    @InjectRepository(FunctionaryEntity)
    private readonly functionaryRepository: Repository<FunctionaryEntity>,
  ) {}

  async create(
    createPositionDto: CreatePositionDto,
  ): Promise<ApiResponse<PositionEntity>> {
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

      return {
        message: 'Posición creada exitosamente',
        data: detailedPosition,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<
    ApiResponse<{
      count: number
      positions: PositionEntity[]
    }>
  > {
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
        message: 'Posiciones encontradas exitosamente',
        data: { count, positions },
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<ApiResponse<PositionEntity>> {
    try {
      const position = await this.positionRepository.findOneBy({ id })

      if (!position) {
        throw new NotFoundException('Position not found')
      }

      return {
        message: 'Posición encontrada exitosamente',
        data: position,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByField(
    field: string,
    paginationDTO: PaginationDto,
  ): Promise<
    ApiResponse<{
      count: number
      positions: PositionEntity[]
    }>
  > {
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
      message: 'Posiciones encontradas exitosamente',
      data: { count, positions },
    }
  }

  async update(
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): Promise<ApiResponse<PositionEntity>> {
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

      const positionUpdated = await this.positionRepository.save(position)

      return {
        message: 'Posición actualizada exitosamente',
        data: positionUpdated,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number): Promise<ApiResponse> {
    try {
      await this.positionRepository.delete({ id })

      return {
        message: 'Posición eliminada exitosamente',
        data: {
          success: true,
        },
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeBulk(ids: number[]): Promise<ApiResponse> {
    try {
      this.positionRepository.delete(ids)
      return {
        message: 'Posiciones eliminadas exitosamente',
        data: {
          success: true,
        },
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
