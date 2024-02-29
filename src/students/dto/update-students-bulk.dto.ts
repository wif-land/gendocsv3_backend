import { IsNotEmpty, IsNumber } from 'class-validator'
import { PartialType } from '@nestjs/swagger'
import { CreateStudentDto } from './create-student.dto'

export class UpdateStudentsBulkItemDto extends PartialType(CreateStudentDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number
}
