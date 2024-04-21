import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'
import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'
import { DtoUtils } from '../../shared/utils/dtos'
import { ApiProperty } from '@nestjs/swagger'

export class DefaultCreationDTO {
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'positionName',
    }),
  })
  public positionName: string

  @IsNumber()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'positionOrder',
    }),
  })
  public positionOrder: number

  @ApiProperty()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'member',
    }),
  })
  public member: number

  @ApiProperty()
  @IsBoolean()
  public isStudent: boolean
}
