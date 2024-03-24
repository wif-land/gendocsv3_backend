import { IsNumber, IsNotEmpty } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateProcessDto } from './create-process.dto'

export class UpdateProcessBulkItemDto extends PartialType(CreateProcessDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del proceso a actualizar',
  })
  id: number
}
