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

    return matchRoles(roles, user.roles)
  }
}

const matchRoles = (roles: string[], userRoles: string[]) => {
  for (const role of roles) {
    if (!userRoles.includes(role)) return false
  }

  return true
}
