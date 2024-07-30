import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { Roles } from './roles.decorator'
import { RolesGuard } from '../guards/roles.guard'
import { RolesType } from '../../shared/constants/roles'

export const Auth = (...roles: RolesType[]) =>
  applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard))
