import { HttpStatus } from '@nestjs/common'
import { NumerationError } from './numeration-error'

export class NumerationNotFound extends NumerationError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: HttpStatus.NOT_FOUND,
      type: 'not-found',
      title: 'No se encontró el recurso para la numeración',
      detail: detail || 'No se encontró la numeración solicitada',
      instance: instance || 'numeration.errors.NumerationNotFound',
    })
  }
}
