import { Injectable } from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudentEntity } from './entities/student.entity'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { StudentBadRequestError } from './errors/student-bad-request'
import { StudentAlreadyExist } from './errors/student-already-exists'
import { StudentError } from './errors/student-error'
import { StudentNotFoundError } from './errors/student-not-found'
import { UpdateStudentsBulkItemDto } from './dto/update-students-bulk.dto'
import { StudentFiltersDto } from './dto/student-filters.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    if (this.studentRepository.findOneBy({ dni: createStudentDto.dni })) {
      throw new StudentAlreadyExist(
        `El estudiante con cédula ${createStudentDto.dni} ya existe`,
      )
    }

    const student = this.studentRepository.create({
      ...createStudentDto,
      career: { id: createStudentDto.career },
      canton: { id: createStudentDto.canton },
    })

    if (!student) {
      throw new StudentBadRequestError(
        'Los datos del estudiante son incorrectos',
      )
    }

    const newStudent = await this.studentRepository.save(student)

    return new ApiResponseDto('Estudiante creado correctamente', newStudent)
  }

  async createBulk(createStudentsBulkDto: UpdateStudentsBulkItemDto[]) {
    const queryRunner =
      this.studentRepository.manager.connection.createQueryRunner()
    await queryRunner.connect()

    try {
      await queryRunner.startTransaction()

      await this.studentRepository.upsert(
        createStudentsBulkDto as unknown as Partial<StudentEntity>[],
        {
          conflictPaths: ['dni'],
          skipUpdateIfNoValuesChanged: true,
        },
      )

      await queryRunner.commitTransaction()

      return new ApiResponseDto('Estudiantes creados correctamente', {
        success: true,
      })
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new StudentError({
        statuscode: 500,
        detail: error.message,
        instance: 'students.errors.StudentsService.createBulk',
      })
    }
  }

  async findAll(paginationDTO: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = paginationDTO
    const students = await this.studentRepository.find({
      order: {
        id: 'ASC',
      },
      take: limit,
      skip: offset,
    })

    if (!students) {
      throw new StudentNotFoundError('No se encontraron estudiantes')
    }

    const count = await this.studentRepository.count()

    return new ApiResponseDto('Estudiantes encontrados', { count, students })
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOneBy({ id })

    if (!student) {
      throw new StudentNotFoundError(`Estudiante con id ${id} no encontrado`)
    }

    return new ApiResponseDto('Estudiante encontrado', student)
  }

  async findByFilters(filters: StudentFiltersDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = filters

    const qb = this.studentRepository.createQueryBuilder('students')

    qb.where(
      '( (:state :: BOOLEAN) IS NULL OR students.isActive = (:state :: BOOLEAN) )',
      {
        state: filters.state,
      },
    )
      .andWhere(
        "( (:term :: VARCHAR ) IS NULL OR CONCAT_WS(' ', students.firstName, students.secondName, students.firstLastName, students.secondLastName) ILIKE :term OR students.dni ILIKE :term )",
        {
          term: filters.field && `%${filters.field.trim()}%`,
        },
      )
      .orderBy('students.id', 'ASC')
      .leftJoinAndSelect('students.career', 'career')
      .leftJoinAndSelect('career.coordinator', 'coordinator')
      .take(limit)
      .skip(offset)
      .getMany()

    const count = await qb.getCount()
    const students = await qb.getMany()

    if (!students || !count) {
      throw new StudentNotFoundError(
        'No se encontraron estudiantes con los datos proporcionados',
      )
    }

    return new ApiResponseDto('Estudiantes encontrados', {
      count,
      students,
    })
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      let student = await this.studentRepository.preload({
        ...updateStudentDto,
        id,
        career: { id: updateStudentDto.career },
        canton: { id: updateStudentDto.canton },
      })

      if (!student) {
        throw new StudentNotFoundError('Estudiante no encontrado')
      }

      student = await this.studentRepository.save(student)

      const updatedStudent = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.career', 'career')
        .leftJoinAndSelect('career.coordinator', 'coordinator')
        .where('student.id = :id', { id })
        .getOne()

      if (!updatedStudent) {
        throw new StudentError({
          statuscode: 500,
          detail: 'Error al actualizar los datos del estudiante',
          instance: 'students.errors.StudentsService.update',
        })
      }

      return new ApiResponseDto(
        'Estudiante actualizado correctamente',
        updatedStudent,
      )
    } catch (error) {
      throw new StudentError({
        statuscode: 500,
        detail: error.message,
        instance: 'students.errors.StudentsService.update',
      })
    }
  }

  async remove(id: number) {
    const { data: student } = await this.findOne(id)

    if (!student) {
      throw new StudentNotFoundError('Estudiante no encontrado')
    }

    student.isActive = false

    await this.studentRepository.save(student)

    return new ApiResponseDto('Estudiante eliminado correctamente', {
      success: true,
    })
  }
}
