import { IsBooleanString, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from '../../shared/dtos/pagination.dto'

export class FunctionaryFiltersDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  state?: boolean

  @IsOptional()
  @IsString()
  field?: string
}
