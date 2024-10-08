import { BaseError, IError } from '../../shared/utils/error'

export class CityError extends BaseError {
  constructor({
    statuscode,
    type = 'city-module-error',
    title = 'Error en el servicio de ciudades',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `cities/${type}`,
      title,
      detail || 'Un error ha ocurrido en el servicio de ciudades',
      instance || 'cities.errors.CitiesError',
    )
  }
}
