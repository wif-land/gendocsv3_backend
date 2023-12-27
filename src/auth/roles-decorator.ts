import { CustomDecorator, SetMetadata } from '@nestjs/common'

export type RolesType =
  | 'admin'
  | 'user'
  | 'api'
  | 'patiotuerca'
  | 'cc-reports'
  | 'lead-reports'
  | 'sell-reports'

export const Roles = (...roles: RolesType[]): CustomDecorator<string> =>
  SetMetadata('roles', roles)
