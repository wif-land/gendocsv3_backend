import { FunctionaryError } from './functionary-error'

export class FunctionaryBadRequestError extends FunctionaryError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 400,
      type: 'bad-request',
      title: 'Error en la petición del funcionarios',
      detail: detail || 'La petición del funcionarios es incorrecta',
      instance: instance || 'functionaries.errors.FunctionaryBadRequestError',
    })
  }
}
