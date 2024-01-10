import { CouncilAttendanceRole } from '../interfaces/council-attendance.interface'
import { IsNotEmpty } from 'class-validator'

export class CreateAttendanceDto {
  @IsNotEmpty({ message: 'Council id is required' })
  councilId: number

  @IsNotEmpty({ message: 'Functionary id is required' })
  functionaryId: string

  @IsNotEmpty({ message: 'hasAttended field is required' })
  role: CouncilAttendanceRole
}
