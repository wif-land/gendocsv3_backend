import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator'

export class CreateCellGradeDegreeCertificateTypeDto {
  @ApiProperty({
    description: 'Id del tipo de certificado',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  certificateTypeId: number

  @ApiProperty({
    description: 'Celda de la hoja de calculo',
    example: 'C5',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  cell: string

  @ApiProperty({
    description: 'Variable de la celda',
    example: 'NOTAMALLA',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  gradeVariable: string
}
