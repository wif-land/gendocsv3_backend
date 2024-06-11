import { IsOptional, IsBooleanString, IsString } from 'class-validator'
import { PaginationDto } from '../../shared/dtos/pagination.dto'

export class StudentFiltersDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  state?: boolean

  @IsOptional()
  @IsString()
  field?: string
}
