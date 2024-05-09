import { BaseError, IError } from '../../shared/utils/error'

export class YearModuleError extends BaseError {
  constructor({
    statuscode,
    type = 'year-module-module-error',
    title = 'Error en el servicio de Modulos por Año',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `year-module/${type}`,
      title,
      detail || 'Un error ha ocurrido en el servicio de Modulos por Año',
      instance || 'year-module.errors.YearModuleError',
    )
  }
}
