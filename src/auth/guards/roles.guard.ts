import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { ROLE_METADATA } from '../constants'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<string[]>(
      ROLE_METADATA,
      context.getHandler(),
    )
    if (!validRoles || validRoles.length === 0) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user

    const isValid = matchRoles(validRoles, user.role)
    if (isValid) return true

    throw new ForbiddenException(
      `Error de autorización. Usuario necesita roles: [${validRoles}]`,
    )
  }
}

const matchRoles = (roles: string[], userRole: string) =>
  roles.some((role) => role === userRole)
