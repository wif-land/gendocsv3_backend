import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { ROLE_METADATA } from '../constants'
import { RolesType } from '../../shared/constants/roles'

export const Roles = (...roles: RolesType[]): CustomDecorator<string> =>
  SetMetadata(ROLE_METADATA, roles)
