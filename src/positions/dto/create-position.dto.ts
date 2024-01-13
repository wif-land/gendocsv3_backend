import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreatePositionDto {
  @ApiProperty({
    description: '{{DECANA}}',
  })
  @IsString({
    message: 'variable is required',
  })
  variable: string

  @ApiProperty({
    description: 'Nombre del cargo',
  })
  @IsString({
    message: 'name is required',
  })
  name: string

  @ApiProperty({
    description: 'Id del funcionario',
  })
  @IsNumber()
  @IsNotEmpty({
    message: 'functionaryId is required',
  })
  functionaryId: number
}
