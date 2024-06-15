import { DataSource } from 'typeorm'
import { Validator } from '../../core/validator'
import { DegreeCertificateBadRequestError } from '../../degree-certificates/errors/degree-certificate-bad-request'
import { DegreeCertificateEntity } from '../../degree-certificates/entities/degree-certificate.entity'
import { DegreeCertificateAttendanceEntity } from '../entities/degree-certificate-attendance.entity'

export class DegreeCertificateThatOverlapValidator extends Validator<number> {
  constructor(dataSource: DataSource) {
    super(
      'Uno o más miembros del consejo se encuentran en otro consejo en la misma fecha. Por favor, verifique los datos e intente nuevamente.',
      dataSource,
    )
  }

  public async validate(attendanceId: number) {
    const degreeCertificateAttendance = await this.dataSource.manager
      .createQueryBuilder(DegreeCertificateAttendanceEntity, 'dca')
      .innerJoinAndSelect('dca.degreeCertificate', 'degreeCertificate')
      .innerJoinAndSelect('dca.functionary', 'functionary')
      .where('dca.id = :attendanceId', {
        attendanceId,
      })
      .getOne()

    const degreeCertificateData = await this.dataSource.manager
      .createQueryBuilder(DegreeCertificateEntity, 'dc')
      .where('dc.id = :dcId', {
        dcId: degreeCertificateAttendance.degreeCertificate.id,
      })
      .select(['dc.id', 'dc.presentationDate', 'dc.duration'])
      .getOne()

    if (!degreeCertificateData) {
      throw new DegreeCertificateBadRequestError(
        'No se encontró el acta de grado',
      )
    }

    if (!degreeCertificateData.presentationDate) {
      throw new DegreeCertificateBadRequestError(
        'No se puede marcar la asistencia al acta de grado porque no tiene fecha de presentación',
      )
    }

    const degreeCertificateAlreadyMarked = await this.dataSource.manager
      .createQueryBuilder(DegreeCertificateEntity, 'dc')
      .innerJoin('dc.attendances', 'dca')
      .innerJoin('dca.functionary', 'functionary')
      .where('dc.presentationDate between :start and :end', {
        start: degreeCertificateData.presentationDate,
        end: new Date(
          new Date(degreeCertificateData.presentationDate).getTime() +
            degreeCertificateData.duration * 60 * 1000,
        ),
      })
      .andWhere('functionary.id = :functionaryId', {
        functionaryId: degreeCertificateAttendance.functionary.id,
      })
      .andWhere('dc.id != :dcId', {
        dcId: degreeCertificateData.id,
      })
      .getOne()

    if (degreeCertificateAlreadyMarked) {
      throw new DegreeCertificateBadRequestError(
        'Ya existe una asistencia al acta de grado para este funcionario en otra acta de grado en la misma franja horaria',
      )
    }
  }
}
