import { DegreeCertificateError } from './degree-certificate'

export class DegreeCertificateBadRequestError extends DegreeCertificateError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 400,
      type: 'bad-request',
      title: 'Error en la petición de actas de grado',
      detail: detail || 'La petición de actas de grado es incorrecta',
      instance:
        instance ||
        'degreeCertificates.errors.DegreeCertificateBadRequestError',
    })
  }
}
