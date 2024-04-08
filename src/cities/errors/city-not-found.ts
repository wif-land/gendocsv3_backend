import { CityError } from './city-error'

export class CityNotFoundError extends CityError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 404,
      type: 'Ciudad no encontrada',
      title: 'Ciudad no encontrada',
      detail: detail || 'La ciudad que buscas no existe',
      instance: instance || 'cities.errors.CityNotFoundError',
    })
  }
}
