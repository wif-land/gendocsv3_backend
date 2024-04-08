import { CityError } from './city-error'

export class ProvinceNotFoundError extends CityError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 404,
      type: 'Provincia no encontrada',
      title: 'Provincia no encontrada',
      detail: detail || 'La provincia que buscas no existe',
      instance: instance || 'cities.errors.ProvinceNotFoundError',
    })
  }
}
