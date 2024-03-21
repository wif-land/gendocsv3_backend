import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateVariableDto {
  @ApiProperty({
    example: '{{SALUDO}}',
    description: 'Variable',
  })
  @IsNotEmpty()
  variable: string

  @ApiProperty({
    example: 'Variable de saludo general',
    description: 'nombre de la variable',
  })
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 'Hola Mundo',
    description: 'Valor de la variable',
  })
  @IsNotEmpty()
  value: string
}
