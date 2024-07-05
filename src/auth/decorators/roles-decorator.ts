import { CustomDecorator, SetMetadata } from '@nestjs/common'

export enum RolesType {
  ADMIN = 'ADMIN',
  TEMP_ADMIN = 'TEMP_ADMIN',
  WRITER = 'WRITER',
  READER = 'READER',
  API = 'API',
}

export const Roles = (...roles: RolesType[]): CustomDecorator<string> =>
  SetMetadata('roles', roles)
