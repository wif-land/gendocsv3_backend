import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive } from 'class-validator'

export class PaginationDTO {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page? = 1

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  moduleId?: number
}
