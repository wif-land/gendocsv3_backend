import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateCareerDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'internshipHours is required' })
  @IsNumber()
  internshipHours: number

  @ApiProperty()
  @IsNotEmpty({ message: 'vinculationHours is required' })
  @IsNumber()
  vinculationHours: number

  @ApiProperty()
  @IsNotEmpty({ message: 'coordinator is required' })
  @IsNumber()
  coordinator: number

  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string

  @ApiProperty()
  @IsNotEmpty({ message: 'credits is required' })
  @IsNumber()
  credits: number

  @ApiProperty()
  @IsNotEmpty({ message: 'menDegree is required' })
  menDegree: string

  @ApiProperty()
  @IsNotEmpty({ message: 'womenDegree is required' })
  womenDegree: string

  @ApiProperty()
  @IsNotEmpty({ message: 'isActive is required' })
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive: boolean

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre del módulo es requerido' })
  @IsString({ message: 'moduleName must be a string' })
  moduleName: string

  @ApiProperty()
  @IsNotEmpty({ message: 'El código de módulo es requerido' })
  moduleCode: string

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  predecessorId?: number
}
