import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'
import { DtoUtils } from '../../shared/utils/dtos'
import { CouncilAttendanceRole } from '../interfaces/council-attendance.interface'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class CreateAttendanceDto {
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'functionaryId',
    }),
  })
  functionaryId: string

  @IsEnum(CouncilAttendanceRole, {
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.isEnum, {
      '{field}': 'role',
      enum: CouncilAttendanceRole,
    }),
  })
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      field: 'functionaryId',
    }),
  })
  role: CouncilAttendanceRole
}
