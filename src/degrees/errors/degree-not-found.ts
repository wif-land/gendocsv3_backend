import { DegreeError } from './degree-error'

export class DegreeNotFoundError extends DegreeError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 404,
      type: 'not-found',
      title: 'Título no encontrado',
      detail: detail || 'El título no ha sido encontrado',
      instance: instance || 'degrees.errors.DegreeNotFoundError',
    })
  }
}
