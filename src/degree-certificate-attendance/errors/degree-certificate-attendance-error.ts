import { BaseError, IError } from '../../shared/utils/error'

export class DegreeCertificateAttendanceError extends BaseError {
  constructor({
    statuscode,
    type = 'degree-certificate-attendance-module-error',
    title = 'Error en el servicio de asistencia de miembros de actas de grado',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `degree-certificate-attendance/${type}`,
      title,
      detail ||
        'Un error ha ocurrido en el servicio de  asistencia de miembros de actas de grado',
      instance ||
        'degreeCertificateAttendance.errors.DegreeCertificateAttendanceError',
    )
  }
}
