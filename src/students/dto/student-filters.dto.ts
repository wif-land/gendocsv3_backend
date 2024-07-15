import { IsOptional, IsBooleanString, IsString, IsInt } from 'class-validator'
import { PaginationDto } from '../../shared/dtos/pagination.dto'
import { Type } from 'class-transformer'

export class StudentFiltersDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  state?: boolean

  @IsOptional()
  @IsString()
  field?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  careerId?: number
}
