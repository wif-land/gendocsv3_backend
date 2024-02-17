import { IsNotEmpty, IsNumber } from 'class-validator'
import { CreateFunctionaryDto } from './create-functionary.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateFunctionariesBulkItemDto extends PartialType(
  CreateFunctionaryDto,
) {
  @IsNumber()
  @IsNotEmpty()
  id: number
}
