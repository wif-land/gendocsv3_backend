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

  async findByField(field: string, paginationDto: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = paginationDto

    const queryBuilder =
      this.functionaryRepository.createQueryBuilder('functionaries')

    const functionaries = await queryBuilder
      .where(
        `UPPER(functionaries.first_name) like :field 
        or UPPER(functionaries.second_name) like :field 
        or UPPER(functionaries.first_last_name) like :field 
        or UPPER(functionaries.second_last_name) like :field 
        or functionaries.dni like :field`,
        { field: `%${field.toUpperCase()}%` },
      )
      .orderBy('functionaries.id', 'ASC')
      .take(limit)
      .skip(offset)
      .getMany()

    const count = await queryBuilder.getCount()

    if (functionaries.length === 0 || count === 0) {
      throw new NotFoundException('Functionaries not found')
    }

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
