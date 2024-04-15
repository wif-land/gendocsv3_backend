import { CityError } from './city-error'

export class CityAlreadyExists extends CityError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'already-exists',
      title: 'La ciudad ya existe',
      detail: detail || 'La ciudad que intentas crear ya existe',
      instance: instance || 'cities.errors.CityAlreadyExists',
    })
  }
}
