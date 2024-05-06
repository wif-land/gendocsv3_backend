import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateCertificateTypeStatusDto {
  @ApiProperty({
    description: 'Id del tipo de certificado',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  certificateTypeId: number

  @ApiProperty({
    description: 'Id del estado de certificado',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  certificateStatusId: number
}
