import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'

export class CreateNumerationDocumentDto {
  @ApiProperty({
    example: '1',
    description: 'Número para usar en la numeración',
  })
  @IsNumber()
  @IsPositive()
  number: number

  @ApiProperty({
    example: '1',
    description: 'Identificador único del consejo',
  })
  @IsNumber()
  @IsPositive()
  councilId: number
}
