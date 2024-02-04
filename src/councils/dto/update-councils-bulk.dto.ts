import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsObject,
  ValidateNested,
  IsNumber,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UpdateCouncilDto } from './update-council.dto'

class UpdateCouncilBulkItemDto extends UpdateCouncilDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del consejo a actualizar',
  })
  id: number
}

export class UpdateCouncilsBulkDto {
  @ApiProperty({
    isArray: true,
    type: UpdateCouncilBulkItemDto,
    description: 'Arreglo de consejos a actualizar',
  })
  @IsArray()
  @IsObject({ each: true })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateCouncilBulkItemDto)
  councils: UpdateCouncilBulkItemDto[]
}
