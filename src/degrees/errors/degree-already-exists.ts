import { DegreeError } from './degree-error'

export class DegreeAlreadyExist extends DegreeError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'already-exist',
      title: 'Título ya existente',
      detail: detail || 'El título ya se encuentra registrado en el sistema',
      instance: instance || 'degrees.errors.DegreeAlreadyExist',
    })
  }
}
