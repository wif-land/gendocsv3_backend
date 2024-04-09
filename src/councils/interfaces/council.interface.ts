export enum COUNCIL_TYPES {
  EXTRAORDINARY = 'EXTRAORDINARY',
  ORDINARY = 'ORDINARY',
}

export interface ICouncil {
  name: string
  type: COUNCIL_TYPES
  date: Date
}
