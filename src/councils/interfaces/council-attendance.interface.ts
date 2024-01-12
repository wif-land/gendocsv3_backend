import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { CouncilEntity } from '../entities/council.entity'

export enum CouncilAttendanceRole {
  PRESIDENT = 'PRESIDENT',
  SUBROGATE = 'SUBROGATE',
  MEMBER = 'MEMBER',
}

export interface ICouncilAttendance {
  council: CouncilEntity
  functionary: FunctionaryEntity
  hasAttended: boolean
  hasBeenNotified: boolean
  role: CouncilAttendanceRole
}
