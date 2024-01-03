import { PartialType } from '@nestjs/swagger'
import { CreateFunctionaryDto } from './create-functionary.dto'

export class UpdateFunctionaryDto extends PartialType(CreateFunctionaryDto) {}
