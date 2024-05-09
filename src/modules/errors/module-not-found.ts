import { HttpStatus } from '@nestjs/common'
import { ModulesError } from './module-error'

export class ModulesNotFound extends ModulesError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: HttpStatus.NOT_FOUND,
      type: 'not-found',
      title: 'Modulo no encontrado',
      detail: detail || 'El modulo que buscas no existe',
      instance: instance || 'modules.errors.ModulesNotFoundError',
    })
  }
}
