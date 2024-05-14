import { HttpStatus } from '@nestjs/common'
import { NumerationError } from './numeration-error'

export class NumerationBadRequest extends NumerationError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: HttpStatus.BAD_REQUEST,
      type: 'bad-request',
      title: 'Existen errores en la petición de la numeración',
      detail: detail || 'La petición de la numeración es incorrecta',
      instance: instance || 'numeration.errors.NumerationBadRequest',
    })
  }
}
