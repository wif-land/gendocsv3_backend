export enum CouncilType {
  EXTRAORDINARY = 'EXTRAORDINARY',
  ORDINARY = 'ORDINARY',
}

export interface ICouncil {
  name: string
  type: CouncilType
  date: Date
}
