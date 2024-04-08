import { DegreeError } from './degree-error'

export class DegreeBadRequestError extends DegreeError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 400,
      type: 'bad-request',
      title: 'Error en la petición del título',
      detail: detail || 'La petición del título es incorrecta',
      instance: instance || 'degrees.errors.DegreeBadRequestError',
    })
  }
}
