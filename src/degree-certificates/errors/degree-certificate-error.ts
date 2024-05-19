import { BaseError, IError } from '../../shared/utils/error'

export class DegreeCertificateError extends BaseError {
  constructor({
    statuscode,
    type = 'degree-certificate-module-error',
    title = 'Error en el servicio de actas de grado',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `degree-certificates/${type}`,
      title,
      detail || 'Un error ha ocurrido en el servicio de actas de grado',
      instance || 'degreeCertificates.errors.DegreeCertificateError',
    )
  }
}
