import { DegreeCertificateAttendanceError } from './degree-certificate-attendance-error'

export class DegreeCertificateAttendanceBadRequestError extends DegreeCertificateAttendanceError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 400,
      type: 'bad-request',
      title: 'Error en la petición de asistencia de miembros de actas de grado',
      detail:
        detail ||
        'La petición de asistencia de miembros de actas de grado es incorrecta',
      instance:
        instance ||
        'degreeCertificateAttendance.errors.DegreeCertificateAttendanceBadRequestError',
    })
  }
}
