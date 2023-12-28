import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from './jwt-auth.guard'
import { Roles, RolesType } from './roles-decorator'
import { RolesGuard } from './roles.guard'

export const Auth = (...roles: RolesType[]) =>
  applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
  )
