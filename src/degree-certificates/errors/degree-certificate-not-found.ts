import { DegreeCertificateError } from './degree-certificate-error'

export class DegreeCertificateNotFoundError extends DegreeCertificateError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 404,
      type: 'not-found',
      title: 'Error en la búsqueda de actas de grado',
      detail: detail || 'No se encontró la acta de grado solicitada',
      instance:
        instance || 'degreeCertificates.errors.DegreeCertificateNotFoundError',
    })
  }
}
