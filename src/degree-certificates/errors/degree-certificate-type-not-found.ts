import { DegreeCertificateError } from './degree-certificate-error'

export class DegreeCertificateTypeNotFoundError extends DegreeCertificateError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 404,
      type: 'not-found',
      title: 'Modalidades de grado no encontradas',
      detail:
        detail ||
        'No se encontró modalidades de grado con los criterios especificados',
      instance:
        instance ||
        'degreeCertificates.errors.DegreeCertificateTypeNotFoundError',
    })
  }
}
