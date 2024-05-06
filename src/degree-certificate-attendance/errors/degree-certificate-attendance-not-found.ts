import { DegreeCertificateAttendanceError } from './degree-certificate-attendance-error'

export class DegreeCertificateAttendanceNotFoundError extends DegreeCertificateAttendanceError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 404,
      type: 'not-found',
      title: 'Error en la búsqueda de asistencia de miembros de actas de grado',
      detail:
        detail ||
        'No se encontró la asistencia de miembros de actas de grado solicitada',
      instance:
        instance ||
        'degreeCertificateAttendance.errors.DegreeCertificateAttendanceNotFoundError',
    })
  }
}
