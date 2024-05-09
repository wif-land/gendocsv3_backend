import { Expose } from 'class-transformer'
import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'
import { DtoUtils } from '../../shared/utils/dtos'
import { IsNotEmpty } from 'class-validator'

export class CreateAttendanceDto {
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'member',
    }),
  })
  @Expose({ name: 'id' })
  member: string

  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'isStudent',
    }),
  })
  isStudent: boolean

  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'positionName',
    }),
  })
  positionName: string

  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'positionOrder',
    }),
  })
  positionOrder: number
}
