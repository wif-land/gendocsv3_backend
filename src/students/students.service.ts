import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Student } from './entities/student.entity'
import { CreateStudentsBulkDto } from './dto/create-students-bulk.dto'
import { PaginationDto } from '../shared/dtos/pagination.dto'
import { UpdateStudentsBulkItemDto } from './dto/update-students-bulk.dto'
import { StudentFiltersDto } from './dto/student-filters.dto'

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const student = this.studentRepository.create({
        ...createStudentDto,
        career: { id: createStudentDto.career },
      })

      if (!student) {
        throw new BadRequestException('Student not created')
      }

      return await this.studentRepository.save(student)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createBulk(
    createStudentsBulkDto: CreateStudentsBulkDto,
  ): Promise<boolean> {
    const queryRunner =
      this.studentRepository.manager.connection.createQueryRunner()
    await queryRunner.startTransaction()

    try {
      for (const studentDto of createStudentsBulkDto.students) {
        let student = await this.studentRepository.findOne({
          where: { dni: studentDto.dni },
        })

        if (student) {
          student = this.studentRepository.merge(student, {
            ...studentDto,
            career: { id: studentDto.career },
          })
        } else {
          student = this.studentRepository.create({
            ...studentDto,
            career: { id: studentDto.career },
          })
        }

        await queryRunner.manager.save(student)
      }

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return true
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new HttpException(error.message, error.status)
    }
  }

  async findAll(paginationDTO: PaginationDto) {
    // eslint-disable-next-line no-magic-numbers
    const { limit = 5, offset = 0 } = paginationDTO
    try {
      const students = await this.studentRepository.find({
        order: {
          id: 'ASC',
        },
        take: limit,
        skip: offset,
      })

      if (!students) {
        throw new BadRequestException('Students not found')
      }

      const count = await this.studentRepository.count()

      return {
        count,
        students,
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<Student> {
    try {
      const student = await this.studentRepository.findOneBy({ id })

      if (!student) {
        throw new BadRequestException(`Student with id ${id} not found`)
      }

      return student
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
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

    if (count === 0) {
      throw new NotFoundException('Students not found')
    }

    const students = await qb.getMany()

    return {
      count,
      students,
    }
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      let student = await this.studentRepository.preload({
        ...updateStudentDto,
        id,
        career: { id: updateStudentDto.career },
      })

      if (!student) {
        throw new BadRequestException('Student not found')
      }

      student = await this.studentRepository.save(student)

      const updatedStudent = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.career', 'career')
        .leftJoinAndSelect('career.coordinator', 'coordinator')
        .where('student.id = :id', { id })
        .getOne()

      if (!updatedStudent) {
        throw new HttpException(
          'Error retrieving updated student with career.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }

      return updatedStudent
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateBulk(updateStudentsBulkDto: UpdateStudentsBulkItemDto[]) {
    const queryRunner =
      this.studentRepository.manager.connection.createQueryRunner()
    await queryRunner.startTransaction()

    try {
      const updatedStudents = []
      for (const studentDto of updateStudentsBulkDto) {
        const student = await this.studentRepository.preload({
          ...studentDto,
          id: studentDto.id,
          career: { id: studentDto.career },
        })

        if (!student) {
          throw new BadRequestException('Student not found')
        }

        await queryRunner.manager.save(student)
        updatedStudents.push(student)
      }

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return updatedStudents
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new HttpException(error.message, error.status)
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const student = await this.findOne(id)

      if (!student) {
        throw new NotFoundException('Student not found')
      }

      student.isActive = !student.isActive

      await this.studentRepository.save(student)

      return true
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
