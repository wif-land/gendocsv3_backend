import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class BulkDeletePosition {
  @ApiProperty({
    description: 'Id de los cargos',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({
    message: 'ids is required',
  })
  ids: number[]
}
