import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    if (!roles) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user

    return matchRoles(roles, user.role)
  }
}

const matchRoles = (roles: string[], userRole: string) =>
  roles.some((role) => role === userRole)
