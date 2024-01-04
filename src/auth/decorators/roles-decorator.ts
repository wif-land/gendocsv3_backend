import { CustomDecorator, SetMetadata } from '@nestjs/common'

export type RolesType = 'ADMIN' | 'WRITER' | 'READER' | 'API'

export const Roles = (...roles: RolesType[]): CustomDecorator<string> =>
  SetMetadata('roles', roles)
