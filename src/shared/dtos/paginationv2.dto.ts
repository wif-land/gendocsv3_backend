import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class PaginationV2Dto {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  page?: number

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  rowsPerPage?: number

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  orderBy?: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  order?: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  moduleId?: string
}
