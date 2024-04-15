import { HttpStatus } from '@nestjs/common'
import { YearModuleError } from './year-module-error'

export class YearModuleNotFound extends YearModuleError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: HttpStatus.NOT_FOUND,
      type: 'not-found',
      detail: detail || 'El año registrado para el módulo no existe',
      instance: instance || 'yearModule.errors.YearModuleNotFound',
    })
  }
}
