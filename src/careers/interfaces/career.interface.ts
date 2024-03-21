import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'

export interface ICareer {
  name: string
  credits: number
  menDegree: string
  womenDegree: string
  isActive: boolean
  internshipHours: number
  vinculationHours: number
  // coordinator: string
  coordinator: FunctionaryEntity
}
