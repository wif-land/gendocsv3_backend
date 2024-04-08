import { CityError } from './city-error'

export class CityAlreadyExistsError extends CityError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'already-exists',
      title: 'Ciudad ya existe',
      detail: detail || 'La ciudad que intentas crear ya existe',
      instance: instance || 'cities.errors.CityAlreadyExistsError',
    })
  }
}
