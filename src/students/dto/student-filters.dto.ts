import {
  IsOptional,
  IsBooleanString,
  IsString,
  MinLength,
} from 'class-validator'
import { PaginationDto } from '../../shared/dtos/pagination.dto'

export class StudentFiltersDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  state?: boolean

  @IsOptional()
  @IsString()
  @MinLength(1)
  field?: string
}
