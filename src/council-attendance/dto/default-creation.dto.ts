import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'
import { DtoUtils } from '../../shared/utils/dtos'

export class DefaultCreationDTO {
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'module',
    }),
  })
  public module: string

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

  @IsOptional()
  @IsNumber(
    {},
    {
      message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.isNumber, {
        '{field}': 'functionary',
      }),
    },
  )
  public functionary?: number

  @IsOptional()
  @IsNumber(
    {},
    {
      message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.isNumber, {
        '{field}': 'student',
      }),
    },
  )
  public student?: number
}
