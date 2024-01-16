import { CouncilAttendanceRole } from '../interfaces/council-attendance.interface'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateAttendanceDto {
  @IsNotEmpty({ message: 'Council id is required' })
  councilId: number

  @IsNotEmpty({ message: 'Functionary id is required' })
  @IsNumber()
  functionaryId: number

  @IsNotEmpty({ message: 'hasAttended field is required' })
  role: CouncilAttendanceRole
}
