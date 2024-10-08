import { BaseError, IError } from '../../shared/utils/error'

export class DegreeError extends BaseError {
  constructor({
    statuscode,
    type = 'degree-module-error',
    title = 'Error en el servicio de títulos',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `degrees/${type}`,
      title,
      detail || 'Un error ha ocurrido en el servicio de títulos',
      instance || 'degrees.errors.DegreeError',
    )
  }
}
