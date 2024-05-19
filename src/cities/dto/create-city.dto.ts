import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreateCityDto {
  @ApiProperty({
    description: 'Nombre de la ciudad',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Código de la provincia a la que pertenece',
    type: Number,
  })
  @IsNotEmpty()
  @IsPositive()
  provinceId: number
}
