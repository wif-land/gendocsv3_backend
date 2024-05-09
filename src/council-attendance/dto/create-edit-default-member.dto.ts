import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator'
import { DtoUtils } from '../../shared/utils/dtos'
import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'

export class CreateEditDefaultMemberDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'id',
    }),
  })
  @ValidateIf((o) => o.action === 'update' || o.action === 'delete')
  id: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'positionOrder',
    }),
  })
  @ValidateIf((o) => o.action === 'create')
  positionOrder: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'positionName',
    }),
  })
  @ValidateIf((o) => o.action === 'create')
  positionName: string

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'isStudent',
    }),
  })
  isStudent: boolean

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'member',
    }),
  })
  @ValidateIf((o) => o.action === 'create')
  member?: number

  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'action',
    }),
  })
  action: 'update' | 'delete' | 'create'
}
