import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { CreateStudentDto } from './create-student.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateStudentsBulkDto {
  @ApiProperty({
    isArray: true,
    type: CreateStudentDto,
    description: 'Arreglo de estudiantes a crear',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[]
}
