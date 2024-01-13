import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

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
  @IsNumber()
  @IsNotEmpty({
    message: 'functionaryId is required',
  })
  functionaryId: number
}
