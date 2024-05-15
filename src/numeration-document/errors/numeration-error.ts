import { BaseError, IError } from '../../shared/utils/error'

export class NumerationError extends BaseError {
  constructor({
    statuscode,
    type = 'numeration-module-error',
    title = 'Error en el servicio de Modulos',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `numeration/${type}`,
      title,
      detail || 'Un error ha ocurrido en el servicio de Numeración',
      instance || 'numeration.errors.NumerationError',
    )
  }
}
