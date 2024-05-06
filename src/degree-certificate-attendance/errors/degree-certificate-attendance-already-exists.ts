import { DegreeCertificateAttendanceError } from './degree-certificate-attendance-error'

export class DegreeCertificateAttendanceAlreadyExists extends DegreeCertificateAttendanceError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'already-exist',
      title: 'La asistencia en la acta de grado ya existe en el sistema',
      detail:
        detail ||
        'La asistencia en la acta de grado ya existe en el sistema, por favor verifique los datos e intente nuevamente',
      instance:
        instance ||
        'degreeCertificateAttendance.errors.DegreeCertificateAttendanceAlreadyExists',
    })
  }
}
