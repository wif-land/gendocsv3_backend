import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Student } from './entities/student.entity'
import { CreateStudentsBulkDto } from './dto/create-students-bulk.dto'

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const student = this.studentRepository.create({
        career: { id: createStudentDto.careerId },
        ...createStudentDto,
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
    const students = createStudentsBulkDto.students
    const studentsPromise = []

    students.forEach((student) => {
      studentsPromise.push(
        this.studentRepository.create({
          career: { id: student.careerId },
          ...student,
        }),
      )
    })

    const queryRunner =
      this.studentRepository.manager.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.save(studentsPromise)
      await queryRunner.commitTransaction()

      await queryRunner.release()

      return true
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()

      this.handleDBExceptions(error)
      await queryRunner.release()
    }
  }

  async findAll(): Promise<Student[]> {
    try {
      const students = await this.studentRepository.find({
        order: {
          id: 'ASC',
        },
      })

      if (!students) {
        throw new BadRequestException('Students not found')
      }

      return students
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<Student> {
    try {
      const student = await this.studentRepository.findOneBy({ id })

      if (!student) {
        throw new BadRequestException('Student not found')
      }

      return student
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      const student = await this.studentRepository.preload({
        id,
        ...updateStudentDto,
        career: { id: updateStudentDto.careerId },
      })

      if (!student) {
        throw new BadRequestException('Student not found')
      }

      return await this.studentRepository.save(student)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const student = await this.findOne(id)

      if (!student) {
        throw new NotFoundException('Student not found')
      }

      student.isActive = false

      await this.studentRepository.save(student)

      return true
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private handleDBExceptions(error) {
    if (error.code === '23505') throw new BadRequestException(error.detail)

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    )
  }
}
