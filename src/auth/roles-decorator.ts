import { CustomDecorator, SetMetadata } from '@nestjs/common'

export type RolesType = 'admin' | 'writer' | 'reader'

export const Roles = (...roles: RolesType[]): CustomDecorator<string> =>
  SetMetadata('roles', roles)
