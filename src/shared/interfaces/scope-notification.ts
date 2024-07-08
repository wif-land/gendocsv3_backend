import { RolesType } from '../constants/roles'

export interface ScopeInterface {
  modules?: number[]
  roles?: RolesType[]
  id?: number
}
