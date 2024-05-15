import { HttpStatus } from '@nestjs/common'
import { NumerationError } from './numeration-error'

export class NumerationAleadyExists extends NumerationError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: HttpStatus.CONFLICT,
      type: 'already-exists',
      title: 'El número a generar ya existe',
      detail: detail || 'El número a generar o reservar ya existe',
      instance: instance || 'numeration.errors.NumerationAlreadyExists',
    })
  }
}
