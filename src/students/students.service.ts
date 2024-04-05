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

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentEntity> {
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

    return await this.studentRepository.save(student)
  }

  async createBulk(
    createStudentsBulkDto: UpdateStudentsBulkItemDto[],
  ): Promise<boolean> {
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

      return true
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

    return {
      count,
      students,
    }
  }

  async findOne(id: number): Promise<StudentEntity> {
    const student = await this.studentRepository.findOneBy({ id })

    if (!student) {
      throw new StudentNotFoundError(`Estudiante con id ${id} no encontrado`)
    }

    return student
  }

  async findByField(field: string, paginationDTO: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = paginationDTO

    const queryBuilder = this.studentRepository.createQueryBuilder('students')

    const students = await queryBuilder
      .where(
        `UPPER(students.first_name) like :field 
        or UPPER(students.second_name) like :field 
        or UPPER(students.first_last_name) like :field 
        or UPPER(students.second_last_name) like :field 
        or students.dni like :field`,
        { field: `%${field.toUpperCase()}%` },
      )
      .orderBy('students.id', 'ASC')
      .take(limit)
      .skip(offset)
      .getMany()

    const count = await queryBuilder.getCount()

    if (!students || !count) {
      throw new StudentNotFoundError(
        'No se encontraron estudiantes con los datos proporcionados',
      )
    }

    return {
      count,
      students,
    }
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity> {
    try {
      const student = await this.studentRepository.preload({
        ...updateStudentDto,
        id,
        career: { id: updateStudentDto.career },
        canton: { id: updateStudentDto.canton },
      })

      if (!student) {
        throw new StudentNotFoundError('Estudiante no encontrado')
      }

      return await this.studentRepository.save(student)
    } catch (error) {
      throw new StudentError({
        statuscode: 500,
        detail: error.message,
        instance: 'students.errors.StudentsService.update',
      })
    }
  }

  async remove(id: number): Promise<boolean> {
    const student = await this.findOne(id)

    if (!student) {
      throw new StudentNotFoundError('Estudiante no encontrado')
    }

    student.isActive = false

    await this.studentRepository.save(student)

    return true
  }
}
