import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Student } from './entities/student.entity'

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

      return await this.studentRepository.save(student)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find()
  }

  async findOne(id: string): Promise<Student> {
    return await this.studentRepository.findOneBy({ id })
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.studentRepository.preload({
      id,
      ...updateStudentDto,
      career: { id: updateStudentDto.careerId },
    })

    if (!student) {
      throw new BadRequestException('Student not found')
    }

    return await this.studentRepository.save(student)
  }

  async remove(id: string): Promise<boolean> {
    const student = await this.findOne(id)

    student.isActive = false

    await this.studentRepository.save(student)

    return true
  }
}
