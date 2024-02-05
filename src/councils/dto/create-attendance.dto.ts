import { CouncilAttendanceRole } from '../interfaces/council-attendance.interface'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateAttendanceDto {
  @IsNumber()
  @IsNotEmpty({ message: 'councilId field is required' })
  functionaryId: number

  @IsNotEmpty({ message: 'hasAttended field is required' })
  role: CouncilAttendanceRole
}
