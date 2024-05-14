import { HttpStatus } from '@nestjs/common'
import { NumerationError } from './numeration-error'

export class NumerationConflict extends NumerationError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: HttpStatus.CONFLICT,
      type: 'conflict',
      title: 'Existe un conflicto en la numeración',
      detail:
        detail ||
        'Se presentó un conflicto en la numeración, por favor verifique los datos ingresados.',
      instance: instance || 'numeration.errors.NumerationConflict',
    })
  }
}
