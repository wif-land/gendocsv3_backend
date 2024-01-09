import { PartialType } from '@nestjs/swagger'
import { CreateCouncilDto } from './create-council.dto'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateCouncilDto extends PartialType(CreateCouncilDto) {
  @IsOptional()
  @IsBoolean()
  isActive: boolean

  @IsOptional()
  @IsBoolean()
  isArchived: boolean
}
