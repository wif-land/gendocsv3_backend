import { CustomDecorator, SetMetadata } from '@nestjs/common'

export type RolesType = 'admin' | 'writer' | 'reader' | 'api'

export const Roles = (...roles: RolesType[]): CustomDecorator<string> =>
  SetMetadata('roles', roles)
