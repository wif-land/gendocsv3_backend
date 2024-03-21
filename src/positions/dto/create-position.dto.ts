import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

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
  @IsString()
  @IsNotEmpty({
    message: 'functionary is required',
  })
  functionary: string
}
