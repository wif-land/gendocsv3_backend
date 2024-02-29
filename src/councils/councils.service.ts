import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateCouncilDto } from './dto/create-council.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CouncilEntity } from './entities/council.entity'
import { DataSource, Repository } from 'typeorm'
import { CouncilAttendanceEntity } from './entities/council-attendance.entity'
import { FilesService } from '../files/files.service'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModuleEntity } from '../year-module/entities/submodule-year-module.entity'
import { SubmodulesNames } from '../shared/enums/submodules-names'
import { ResponseCouncilsDto } from './dto/response-councils.dto'
import { UpdateCouncilDto } from './dto/update-council.dto'
import { UpdateCouncilBulkItemDto } from './dto/update-councils-bulk.dto'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'

@Injectable()
export class CouncilsService {
  constructor(
    @InjectRepository(CouncilEntity)
    private readonly councilRepository: Repository<CouncilEntity>,
    @InjectRepository(FunctionaryEntity)
    private readonly functionaryRepository: Repository<FunctionaryEntity>,
    @InjectRepository(CouncilAttendanceEntity)
    private readonly councilAttendanceRepository: Repository<CouncilAttendanceEntity>,
    @InjectRepository(YearModuleEntity)
    private readonly yearModuleRepository: Repository<YearModuleEntity>,
    @InjectRepository(SubmoduleYearModuleEntity)
    private readonly submoduleYearModuleRepository: Repository<SubmoduleYearModuleEntity>,
    @Inject(FilesService)
    private readonly filesService: FilesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createCouncilDto: CreateCouncilDto) {
    const { attendees = [], ...councilData } = createCouncilDto
    const hasAttendance = attendees.length > 0

    try {
      const year = new Date().getFullYear()

      const yearModule = await this.yearModuleRepository.findOneBy({
        year,
        module: { id: createCouncilDto.moduleId },
      })

      if (!yearModule) {
        throw new NotFoundException('Year module not found')
      }

      const submoduleYearModule =
        await this.submoduleYearModuleRepository.findOneBy({
          name: SubmodulesNames.COUNCILS,
          yearModule: { id: yearModule.id },
        })

      if (!submoduleYearModule) {
        throw new NotFoundException('Submodule year module not found')
      }

      const driveId = await this.filesService.createFolderByParentId(
        councilData.name,
        submoduleYearModule.driveId,
      )

      const council = this.councilRepository.create({
        ...councilData,
        driveId,
        module: { id: createCouncilDto.moduleId },
        user: { id: createCouncilDto.userId },
        submoduleYearModule: { id: submoduleYearModule.id },
      })

      const councilInserted = await this.councilRepository.save(council)

      if (!hasAttendance) {
        return await this.councilRepository.save(council)
      }

      const promises = attendees.map((item) =>
        this.functionaryRepository.findOne({
          where: {
            dni: item.functionaryId,
          },
        }),
      )

      const functionariesIds = (await Promise.all(promises)).map((item) => ({
        id: item.id,
        dni: item.dni,
      }))

      const councilAttendance = attendees.map((item) =>
        this.councilAttendanceRepository.create({
          ...item,
          council: { id: councilInserted.id },
          functionary: {
            id: functionariesIds.find((f) => f.dni === item.functionaryId).id,
          },
        }),
      )

      const attendanceResult = await this.councilAttendanceRepository.save(
        councilAttendance,
      )

      return {
        ...councilInserted,
        attendance: attendanceResult,
      }
    } catch (error) {
      throw error
    }
  }

  async findAllAndCount(paginationDto: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { moduleId, limit = 10, offset = 0 } = paginationDto
    try {
      const queryBuilder = this.dataSource.createQueryBuilder(
        CouncilEntity,
        'councils',
      )
      queryBuilder.leftJoinAndSelect('councils.user', 'user')
      queryBuilder.leftJoinAndSelect('councils.module', 'module')
      queryBuilder.leftJoinAndSelect(
        'councils.submoduleYearModule',
        'submoduleYearModule',
      )
      queryBuilder.leftJoinAndSelect('councils.attendance', 'attendance')
      queryBuilder.leftJoinAndSelect('attendance.functionary', 'functionary')
      queryBuilder.where('module.id = :moduleId', { moduleId })
      queryBuilder.orderBy('councils.createdAt', 'DESC')
      queryBuilder.take(limit)
      queryBuilder.skip(offset)

      const countQueryBuilder = this.dataSource.createQueryBuilder(
        CouncilEntity,
        'councils',
      )
      countQueryBuilder.leftJoin('councils.module', 'module')
      countQueryBuilder.where('module.id = :moduleId', { moduleId })

      const count = await countQueryBuilder.getCount()

      const councils = await queryBuilder.getMany()

      return {
        count,
        councils: councils.map((council) => new ResponseCouncilsDto(council)),
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByField(field: string, paginationDto: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { moduleId, limit = 10, offset = 0 } = paginationDto
    const queryBuilder = this.dataSource.createQueryBuilder(
      CouncilEntity,
      'councils',
    )
    queryBuilder.leftJoinAndSelect('councils.user', 'user')
    queryBuilder.leftJoinAndSelect('councils.module', 'module')
    queryBuilder.leftJoinAndSelect(
      'councils.submoduleYearModule',
      'submoduleYearModule',
    )
    queryBuilder.leftJoinAndSelect('councils.attendance', 'attendance')
    queryBuilder.leftJoinAndSelect('attendance.functionary', 'functionary')
    queryBuilder.orderBy('councils.id', 'ASC')
    queryBuilder.where(
      '(UPPER(councils.name) like :termName or CAST(councils.id AS TEXT) = :termId) and module.id = :moduleId',
      {
        termName: `%${field.toUpperCase()}%`,
        termId: field,
        moduleId,
      },
    )
    queryBuilder.take(limit)
    queryBuilder.skip(offset)

    const countQueryBuilder = this.dataSource.createQueryBuilder(
      CouncilEntity,
      'councils',
    )
    countQueryBuilder.leftJoin('councils.module', 'module')
    countQueryBuilder.where(
      '(UPPER(councils.name) like :termName or CAST(councils.id AS TEXT) = :termId) and module.id = :moduleId',
      {
        termName: `%${field.toUpperCase()}%`,
        termId: field,
        moduleId,
      },
    )

    const count = await countQueryBuilder.getCount()

    const councils = await queryBuilder.getMany()

    if (councils.length === 0) {
      throw new NotFoundException('Council not found')
    }

    const mappedCouncils = councils.map(
      (council) => new ResponseCouncilsDto(council),
    )

    return { count, councils: mappedCouncils }
  }

  async update(id: number, updateCouncilDto: UpdateCouncilDto) {
    const queryBuilder = this.dataSource.createQueryBuilder(
      CouncilEntity,
      'councils',
    )
    const hasNameChanged = updateCouncilDto.name !== undefined

    if (hasNameChanged) {
      queryBuilder.where('councils.id = :id', { id })

      const { driveId } = await queryBuilder.getOne()

      if (!driveId) {
        throw new NotFoundException(`Council not found with id ${id}`)
      }

      await this.filesService.renameAsset(driveId, updateCouncilDto.name)
    }

    const updatedCouncil = await this.councilRepository.preload({
      ...updateCouncilDto,
      id,
    })

    if (!updatedCouncil) {
      throw new NotFoundException(`Council not found with id ${id}`)
    }

    await this.councilRepository.save(updatedCouncil)

    return updatedCouncil
  }

  async updateBulk(updateCouncilsBulkDto: UpdateCouncilBulkItemDto[]) {
    const queryRunner =
      this.councilRepository.manager.connection.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const updatedCouncils = []
      for (const councilDto of updateCouncilsBulkDto) {
        const { id, ...councilData } = councilDto
        const hasNameChanged = councilData.name !== undefined

        if (hasNameChanged) {
          const queryBuilder = this.dataSource.createQueryBuilder(
            CouncilEntity,
            'councils',
          )
          queryBuilder.where('councils.id = :id', { id })

          const { driveId } = await queryBuilder.getOne()

          if (!driveId) {
            throw new NotFoundException(`Council not found with id ${id}`)
          }

          await this.filesService.renameAsset(driveId, councilData.name)
        }

        const updatedCouncil = await this.councilRepository.preload({
          id,
          ...councilData,
        })

        if (!updatedCouncil) {
          throw new NotFoundException(`Council not found with id ${id}`)
        }

        updatedCouncils.push(updatedCouncil)

        await queryRunner.manager.save(updatedCouncil)
      }

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return updatedCouncils
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
