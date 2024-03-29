import {
  IsBooleanString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { PaginationDto } from '../../shared/dtos/pagination.dto'

export class FunctionaryFiltersDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  state?: boolean

  @IsOptional()
  @IsString()
  @MinLength(1)
  field?: string
}
