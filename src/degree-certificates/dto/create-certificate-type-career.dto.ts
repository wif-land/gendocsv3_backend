import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateCertificateTypeCareerDto {
  @ApiProperty({
    description: 'Id del tipo de certificado',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  certificateTypeId: number

  @ApiProperty({
    description: 'Id de la carrera',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  careerId: number
}
