import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { CreateStudentDto } from './create-student.dto'

export class CreateStudentsBulkDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[]
}
