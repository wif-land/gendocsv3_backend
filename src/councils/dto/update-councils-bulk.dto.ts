import { IsNumber, IsNotEmpty } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateCouncilDto } from './create-council.dto'

export class UpdateCouncilBulkItemDto extends PartialType(CreateCouncilDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del consejo a actualizar',
  })
  id: number
}
