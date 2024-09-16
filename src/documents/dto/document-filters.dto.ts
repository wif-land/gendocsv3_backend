import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from '../../shared/dtos/pagination.dto'

export class DocumentFiltersDto extends PaginationDTO {
  @IsOptional()
  @IsString()
  field?: string

  @IsOptional()
  @IsString()
  templateName?: string

  @IsOptional()
  @IsString()
  councilName?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date
}
