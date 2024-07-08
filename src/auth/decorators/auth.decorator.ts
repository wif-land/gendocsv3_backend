import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { Roles, RolesType } from './roles.decorator'
import { RolesGuard } from '../guards/roles.guard'

export const Auth = (...roles: RolesType[]) =>
  applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard))
