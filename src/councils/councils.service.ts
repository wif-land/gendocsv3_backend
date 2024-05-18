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
import { CouncilFiltersDto, DATE_TYPES } from './dto/council-filters.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { StudentEntity } from '../students/entities/student.entity'

@Injectable()
export class CouncilsService {
  constructor(
    @InjectRepository(CouncilEntity)
    private readonly councilRepository: Repository<CouncilEntity>,
    @InjectRepository(FunctionaryEntity)
    private readonly functionaryRepository: Repository<FunctionaryEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
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

    const { data: driveId } = await this.filesService.createFolderByParentId(
      createCouncilDto.name,
      submoduleYearModule.driveId,
    )

    const council = this.councilRepository.create({
      ...createCouncilDto,
      driveId,
      module: { id: createCouncilDto.moduleId },
      user: { id: createCouncilDto.userId },
      submoduleYearModule: { id: submoduleYearModule.id },
    })
    const councilInserted = await this.councilRepository.save(council)
    const councilMembers = createCouncilDto.members.map(async (item) => {
      let memberParam = {}

      if (item.isStudent) {
        const student = await this.studentRepository.findOne({
          where: { id: Number(item.member) },
        })

        if (!student) {
          throw new NotFoundException(
            `Student not found with dni ${item.member}`,
          )
        }

        memberParam = {
          student: { id: student.id },
        }
      } else {
        const functionary = await this.functionaryRepository.findOne({
          where: { id: Number(item.member) },
        })

        if (!functionary) {
          throw new NotFoundException(
            `Functionary not found with dni ${item.member}`,
          )
        }

        memberParam = {
          functionary: { id: functionary.id },
        }
      }

      return this.councilAttendanceRepository.save({
        ...item,
        ...memberParam,
        council: { id: councilInserted.id },
        id: undefined,
      })
    })

    return {
      ...councilInserted,
      members: await Promise.all(councilMembers),
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

      return new ApiResponseDto('Consejos encontrados', {
        count,
        councils: councils.map((council) => new ResponseCouncilsDto(council)),
      })
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByFilters(filters: CouncilFiltersDto) {
    // eslint-disable-next-line no-magic-numbers
    const { moduleId, limit = 10, offset = 0 } = filters

    const qb = this.dataSource.createQueryBuilder(CouncilEntity, 'councils')

    qb.leftJoinAndSelect('councils.user', 'user')
      .leftJoinAndSelect('councils.module', 'module')
      .leftJoinAndSelect('councils.submoduleYearModule', 'submoduleYearModule')
      .leftJoinAndSelect('councils.attendance', 'attendance')
      .leftJoinAndSelect('attendance.functionary', 'functionary')
      .where('module.id = :moduleId', { moduleId })
      .andWhere(
        '( (:state :: BOOLEAN) IS NULL OR councils.isActive = (:state :: BOOLEAN) )',
        {
          state: filters.state,
        },
      )
      .andWhere(
        '( (:name :: VARCHAR) IS NULL OR councils.name ILIKE :name  )',
        {
          name: filters.name && `%${filters.name}%`,
        },
      )
      .andWhere(
        '( (:type :: VARCHAR) IS NULL OR councils.type = (:type :: VARCHAR) )',
        {
          type: filters.type,
        },
      )

    const endDate = new Date(filters.endDate || filters.startDate)
    // eslint-disable-next-line no-magic-numbers
    endDate.setHours(23, 59, 59, 999)

    if (filters.dateType === DATE_TYPES.CREATION) {
      qb.andWhere(
        '( (:startDate :: DATE) IS NULL OR councils.createdAt BETWEEN (:startDate :: DATE) AND (:endDate :: DATE) )',
        {
          startDate: filters.startDate,
          endDate,
        },
      )
    } else if (filters.dateType === DATE_TYPES.EJECUTION) {
      qb.andWhere(
        '( (:startDate :: DATE) IS NULL OR councils.date BETWEEN (:startDate :: DATE) AND (:endDate :: DATE) )',
        {
          startDate: filters.startDate,
          endDate,
        },
      )
    }

    const count = await qb.getCount()
    if (count === 0) {
      throw new NotFoundException('Consejos no encontrados')
    }

    const councils = await qb
      .orderBy('councils.id', 'ASC')
      .take(limit)
      .skip(offset)
      .getMany()

    const mappedCouncils = councils.map(
      (council) => new ResponseCouncilsDto(council),
    )

    return new ApiResponseDto('Consejos encontrados', {
      count,
      councils: mappedCouncils,
    })
  }

  async getById(id: number) {
    const council = await this.councilRepository.findOne({
      where: { id },
      relations: ['attendance', 'attendance.functionary', 'attendance.student'],
    })

    if (!council) {
      throw new NotFoundException(`Council not found with id ${id}`)
    }

    return new ResponseCouncilsDto(council)
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

    const councilMembers = updateCouncilDto.members.map(async (item) => {
      let memberParam = {}

      if (item.isStudent) {
        const student = await this.studentRepository.findOne({
          where: { id: Number(item.member) },
        })

        if (!student) {
          throw new NotFoundException(
            `Student not found with dni ${item.member}`,
          )
        }

        memberParam = {
          student: { id: student.id },
        }
      } else {
        const functionary = await this.functionaryRepository.findOne({
          where: { id: Number(item.member) },
        })

        if (!functionary) {
          throw new NotFoundException(
            `Functionary not found with dni ${item.member}`,
          )
        }

        memberParam = {
          functionary: { id: functionary.id },
        }
      }

      const attendance = await this.councilAttendanceRepository.findOne({
        where: {
          council: { id },
          positionName: item.positionName,
          positionOrder: item.positionOrder,
        },
      })

      if (!attendance) {
        throw new NotFoundException(
          `Attendance not found with positionName ${item.positionName} and positionOrder ${item.positionOrder}`,
        )
      }

      const updatedAttendance = await this.councilAttendanceRepository.preload({
        ...attendance,
        ...item,
        ...memberParam,
      })

      return this.councilAttendanceRepository.save({
        ...updatedAttendance,
        council: { id },
      })
    })

    const updatedCouncil = await this.councilRepository.preload({
      ...updateCouncilDto,
      id,
    })

    if (!updatedCouncil) {
      throw new NotFoundException(`Council not found with id ${id}`)
    }

    const councilUpdated = await this.councilRepository.save(updatedCouncil)

    return {
      ...councilUpdated,
      members: await Promise.all(councilMembers),
    }
  }

  async updateBulk(updateCouncilsBulkDto: UpdateCouncilBulkItemDto[]) {
    const queryRunner =
      this.councilRepository.manager.connection.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const updatedCouncils: CouncilEntity[] = []
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

      return new ApiResponseDto(
        'Consejos actualizados exitosamente',
        updatedCouncils,
      )
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async notifyMembers(id: number, members: number[]) {
    const council = await this.councilRepository.findOne({
      where: { id },
    })

    if (!council) {
      throw new NotFoundException(`Consejo no encontrado`)
    }

    const mutation = `
      UPDATE council_attendance
      SET has_been_notified = true
      WHERE id IN (${members.join(', ')})
      AND council_id = ${id}
    `

    await this.dataSource.query(mutation)
    return true
  }
}
