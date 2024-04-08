import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateProvinceDto {
  @ApiProperty({
    description: 'Nombre de la provincia',
    example: 'Pichincha',
  })
  @IsString()
  @IsNotEmpty()
  name: string
}
