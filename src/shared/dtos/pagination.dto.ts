import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive } from 'class-validator'

export class PaginationDto {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  offset?: number

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  moduleId?: number
}
