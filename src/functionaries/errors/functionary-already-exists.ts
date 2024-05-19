import { FunctionaryError } from './functionary-error'

export class FunctionaryAlreadyExists extends FunctionaryError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'already-exist',
      title: 'Funcionario ya existente',
      detail:
        detail || 'El funcionario ya se encuentra registrado en el sistema',
      instance: instance || 'functionaries.errors.FunctionaryAlreadyExists',
    })
  }
}
