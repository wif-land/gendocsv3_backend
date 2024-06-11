import { RolesType } from '../../auth/decorators/roles-decorator'

export interface ScopeInterface {
  modules?: number[]
  roles?: RolesType[]
  id?: number
}
