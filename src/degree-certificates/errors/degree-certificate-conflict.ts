import { DegreeCertificateError } from './degree-certificate-error'

export class DegreeCertificateConflict extends DegreeCertificateError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'conflict',
      title: 'Error en la petición de actas de grado',
      detail: detail || 'La petición de actas de grado es incorrecta',
      instance:
        instance || 'degreeCertificates.errors.DegreeCertificateConflictError',
    })
  }
}
