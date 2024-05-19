import { CityError } from './city-error'

export class ProvinceAlreadyExistsError extends CityError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'conflict',
      title: 'Provincia ya existe',
      detail: detail || 'La provincia que intentas crear ya existe',
      instance: instance || 'cities.errors.ProvinceAlreadyExistsError',
    })
  }
}
