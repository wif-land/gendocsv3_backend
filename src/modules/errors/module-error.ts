import { BaseError, IError } from '../../shared/utils/error'

export class ModulesError extends BaseError {
  constructor({
    statuscode,
    type = 'modules-module-error',
    title = 'Error en el servicio de Modulos',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `modules/${type}`,
      title,
      detail || 'Un error ha ocurrido en el servicio de Modulos',
      instance || 'modules.errors.ModulesError',
    )
  }
}
