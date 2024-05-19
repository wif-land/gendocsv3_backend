import { HttpStatus } from '@nestjs/common'
import { YearModuleError } from './year-module-error'

export class YearModuleAlreadyExists extends YearModuleError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: HttpStatus.CONFLICT,
      type: 'already-exists',
      detail: detail || 'El año registrado para el módulo ya existe',
      instance: instance || 'yearModule.errors.YearModuleAlreadyExists',
    })
  }
}
