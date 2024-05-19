import { DegreeCertificateError } from './degree-certificate-error'

export class DegreeCertificateAlreadyExists extends DegreeCertificateError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'already-exist',
      title: 'El acta de grado ya existe en el sistema',
      detail:
        detail ||
        'El acta de grado ya existe en el sistema, por favor verifique los datos e intente nuevamente',
      instance:
        instance || 'degreeCertificates.errors.DegreeCertificateAlreadyExists',
    })
  }
}
