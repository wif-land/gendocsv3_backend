import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsPositive } from 'class-validator'

export class CreateDocumentDto {
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

  @ApiProperty({
    example: '1',
    description: 'Identificador único de plantilla',
  })
  @IsNumber()
  @IsPositive()
  templateId: number

  @ApiProperty({
    example: '1',
    description: 'Identificador único del estudiante',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  studentId: number

  @ApiProperty({
    example: '[1, 2, 3]',
    description: 'Identificadores único de los funcionarios',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  functionariesIds: number[]

  @ApiProperty({
    example: '1',
    description: 'Identificador único del usuario',
  })
  @IsNumber()
  @IsPositive()
  userId: number

  @ApiProperty({
    example: 'Defincición de cargos para elecciones',
    description: 'Descripción opcional del documento',
  })
  @IsOptional()
  description: string
}
