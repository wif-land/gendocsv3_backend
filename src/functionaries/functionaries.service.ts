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
import { FunctionaryEntity } from './entities/functionary.entity'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { UpdateFunctionaryDto } from './dto/update-functionary.dto'
import { UpdateFunctionariesBulkItemDto } from './dto/update-functionaries-bulk.dto'
import { FunctionaryFiltersDto } from './dto/functionary-filters.dto'

@Injectable()
export class FunctionariesService {
  constructor(
    @InjectRepository(FunctionaryEntity)
    private readonly functionaryRepository: Repository<FunctionaryEntity>,
  ) {}

  async create(
    createFunctionaryDto: CreateFunctionaryDto,
  ): Promise<FunctionaryEntity> {
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

  async findAll(paginationDto: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = paginationDto

    try {
      const functionaries = await this.functionaryRepository.find({
        order: {
          id: 'ASC',
        },
        take: limit,
        skip: offset,
      })

      if (!functionaries) {
        throw new NotFoundException('Functionaries not found')
      }

      const count = await this.functionaryRepository.count()

      return {
        count,
        functionaries,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<FunctionaryEntity> {
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

  async findByFilters(filters: FunctionaryFiltersDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 10, offset = 0 } = filters

    const qb = this.functionaryRepository.createQueryBuilder('functionaries')

    qb.where(
      '( (:state :: BOOLEAN) IS NULL OR functionaries.isActive = (:state :: BOOLEAN) )',
      {
        state: filters.state,
      },
    )
      .andWhere(
        "( (:term :: VARCHAR ) IS NULL OR CONCAT_WS(' ', functionaries.firstName, functionaries.secondName, functionaries.firstLastName, functionaries.secondLastName) ILIKE :term OR functionaries.dni ILIKE :term )",
        {
          term: filters.field && `%${filters.field.trim()}%`,
        },
      )
      .orderBy('functionaries.id', 'ASC')
      .take(limit)
      .skip(offset)

    const count = await qb.getCount()
    if (count === 0) {
      throw new NotFoundException('Functionaries not found')
    }

    const functionaries = await qb.getMany()

    return {
      count,
      functionaries,
    }
  }

  async update(
    id: number,
    updateFunctionaryDto: UpdateFunctionaryDto,
  ): Promise<FunctionaryEntity> {
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

  async bulkUpdate(
    updateFunctionariesBulkDto: UpdateFunctionariesBulkItemDto[],
  ) {
    const queryRunner =
      this.functionaryRepository.manager.connection.createQueryRunner()

    await queryRunner.connect()

    try {
      await queryRunner.startTransaction()

      const updatedCouncils = []

      for (const updateFunctionary of updateFunctionariesBulkDto) {
        const functionary = await this.functionaryRepository.preload({
          id: updateFunctionary.id,
          ...updateFunctionary,
        })

        if (!functionary) {
          throw new NotFoundException('Functionary not found')
        }

        updatedCouncils.push(await queryRunner.manager.save(functionary))
      }

      await queryRunner.commitTransaction()

      return updatedCouncils
    } catch (error) {
      await queryRunner.rollbackTransaction()

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number): Promise<boolean> {
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
