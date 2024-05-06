import { BaseError, IError } from '../../shared/utils/error'

export class FunctionaryError extends BaseError {
  constructor({
    statuscode,
    type = 'functionary-module-error',
    title = 'Error en el servicio de funcionarios',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `functionaries/${type}`,
      title,
      detail || 'Un error ha ocurrido en el servicio de funcionarios',
      instance || 'functionaries.errors.FunctionaryError',
    )
  }
}
