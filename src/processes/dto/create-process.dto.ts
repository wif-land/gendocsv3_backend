import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateProcessDto {
  @ApiProperty({
    description: 'Nombre del proceso',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Identificador único del drive',
  })
  @IsNotEmpty()
  @IsString()
  driveId: string

  @ApiProperty({
    description: 'Estado de proceso',
    required: false,
  })
  @IsBoolean({
    message: 'isActive is required',
  })
  @IsOptional()
  isActive?: boolean

  @ApiProperty({
    description: 'Usuario asociado al proceso',
  })
  @IsNotEmpty()
  @IsString()
  userId: number

  @ApiProperty({
    description: 'Módulo asociado al proceso',
  })
  @IsNumber()
  @IsNotEmpty()
  moduleId: number
}
