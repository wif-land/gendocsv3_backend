import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { DtoUtils } from '../../shared/utils/dtos'
import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'

export class DefaultEditionDTO {
  @ApiProperty()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'id',
    })
  })
  id: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  positionOrder: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  positionName: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPresident: boolean

  @IsOptional()
  functionary?: number

  @IsOptional()
  student?: number
}
