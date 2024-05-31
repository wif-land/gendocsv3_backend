export enum COUNCIL_TYPES {
  EXTRAORDINARY = 'EXTRAORDINARIA',
  ORDINARY = 'ORDINARIA',
}

export interface ICouncil {
  name: string
  type: COUNCIL_TYPES
  date: Date
}
