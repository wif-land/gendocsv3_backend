import { HttpStatus } from '@nestjs/common'
import { ModulesError } from './module-error'

export class ModulesAlreadyExists extends ModulesError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: HttpStatus.CONFLICT,
      type: 'already-exists',
      title: 'El modulo ya existe',
      detail: detail || 'El módulo que intentas crear ya existe',
      instance: instance || 'modules.errors.ModuleAlreadyExists',
    })
  }
}
