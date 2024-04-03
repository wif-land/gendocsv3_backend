import { FunctionaryError } from './functionary-error'

export class FunctionaryNotFoundError extends FunctionaryError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 404,
      type: 'not-found',
      title: 'Funcionario no encontrado',
      detail: detail || 'El funcionario no ha sido encontrado',
      instance: instance || 'funcionaries.errors.FunctionaryNotFoundError',
    })
  }
}
