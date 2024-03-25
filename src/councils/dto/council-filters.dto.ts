import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'
import { Type } from 'class-transformer'
import { COUNCIL_TYPES } from '../interfaces/council.interface'

enum DATE_TYPES {
  EJECUTION = 'EJECUTION',
  CREATION = 'CREATION',
}

export class CouncilFiltersDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEnum(COUNCIL_TYPES)
  type?: COUNCIL_TYPES

  @IsOptional()
  @IsEnum(DATE_TYPES)
  dateType?: DATE_TYPES

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date
}
