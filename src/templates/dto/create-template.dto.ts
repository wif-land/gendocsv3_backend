import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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
  })
  @IsNotEmpty()
  @IsString()
  state: string

  @ApiProperty({
    description: 'Identificador único del drive',
  })
  @IsNotEmpty()
  @IsString()
  driveId: string

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
    description: 'Proceso asociado a la plantilla',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  processId: string
}
