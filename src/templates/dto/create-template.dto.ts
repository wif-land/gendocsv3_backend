import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator'

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Nombre de la plantilla',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Estado de la plantilla',
    required: false,
  })
  @IsBoolean({
    message: 'isActive is required',
  })
  @IsOptional()
  isActive?: boolean

  @ApiProperty({
    description: 'Indica si la plantilla tiene estudiantes',
  })
  @IsBoolean({
    message: 'hasStudent is required',
  })
  hasStudent: boolean

  @ApiProperty({
    description: 'Indica si la plantilla tiene funcionarios',
  })
  @IsBoolean({
    message: ' hasFuntionary is required',
  })
  hasFuntionary: boolean

  @ApiProperty({
    description: 'Proceso asociado a la plantilla',
  })
  @IsNotEmpty()
  @IsNumber()
  processId: number

  @ApiProperty({
    description: 'Usuario asociado a la plantilla',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number
}
