import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreatePositionDto {
  @ApiProperty({
    description: 'Codigo del cargo',
  })
  @IsString({
    message: 'name is required',
  })
  name: string

  @ApiProperty({
    description: 'Descripción del cargo',
  })
  @IsString({
    message: 'description is required',
  })
  description: string

  @ApiProperty({
    description: 'Id del funcionario',
  })
  @IsString({
    message: 'functionaryId is required',
  })
  functionaryId: string
}
