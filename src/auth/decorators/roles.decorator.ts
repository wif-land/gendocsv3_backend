import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { ROLE_METADATA } from '../constants'

export enum RolesType {
  ADMIN = 'ADMIN',
  TEMP_ADMIN = 'TEMP_ADMIN',
  WRITER = 'WRITER',
  READER = 'READER',
  API = 'API',
}

export const RolesThatCanMutate = [
  RolesType.ADMIN,
  RolesType.TEMP_ADMIN,
  RolesType.WRITER,
  RolesType.API,
]

export const RolesThatCanQuery = [
  RolesType.ADMIN,
  RolesType.TEMP_ADMIN,
  RolesType.WRITER,
  RolesType.READER,
  RolesType.API,
]

export const Roles = (...roles: RolesType[]): CustomDecorator<string> =>
  SetMetadata(ROLE_METADATA, roles)
