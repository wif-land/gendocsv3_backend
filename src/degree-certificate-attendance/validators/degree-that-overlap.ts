import { DataSource } from 'typeorm'
import { Validator } from '../../core/validator'
import { DegreeCertificateBadRequestError } from '../../degree-certificates/errors/degree-certificate-bad-request'
import { DegreeCertificateEntity } from '../../degree-certificates/entities/degree-certificate.entity'
import { DegreeCertificateAttendanceEntity } from '../entities/degree-certificate-attendance.entity'

export interface IDegreeThatOverlapValidator {
  degreeId: number
  validateNewPresentationDate: boolean
  intendedPresentationDate?: Date
  roomId: number
}

export class DegreeCertificateThatOverlapValidator extends Validator<IDegreeThatOverlapValidator> {
  constructor(dataSource: DataSource) {
    super('', dataSource)
  }

  private async getDegreeCertificateData(
    dcId: number,
    validateNewPresentationDate: boolean,
  ) {
    const degreeCertificateData = await this.dataSource.manager
      .createQueryBuilder(DegreeCertificateEntity, 'dc')
      .where('dc.id = :dcId', { dcId })
      .select(['dc.id', 'dc.presentationDate', 'dc.duration'])
      .getOne()

    if (!degreeCertificateData) {
      throw new Error('No se encontró el acta de grado')
    }

    if (
      !degreeCertificateData.presentationDate &&
      !validateNewPresentationDate
    ) {
      throw new Error(
        'No se puede marcar la asistencia al acta de grado porque no tiene fecha de presentación',
      )
    }

    return degreeCertificateData
  }

  private async getDegreeCertificateAttendanceData(degreeId: number) {
    const degreeCertificateAttendance = await this.dataSource.manager
      .createQueryBuilder(DegreeCertificateAttendanceEntity, 'dca')
      .innerJoinAndSelect('dca.degreeCertificate', 'degreeCertificate')
      .innerJoinAndSelect('dca.functionary', 'functionary')
      .where('degreeCertificate.id = :degreeId', { degreeId })
      .getMany()

    return degreeCertificateAttendance.length > 0
      ? degreeCertificateAttendance
      : []
  }

  /**
   * Validates if the degree certificate overlaps with another degree certificate
   *
   * @param {IDegreeThatOverlapValidator} data - Data to validate
   * @param {number} data.degreeId - Degree certificate id
   * @param {boolean} data.validateNewPresentationDate - true if the degree certificate will have a new presentation date
   * @param {Date} data.intendedPresentationDate - Intended presentation date
   */
  public async validate({
    degreeId,
    validateNewPresentationDate,
    intendedPresentationDate,
  }: IDegreeThatOverlapValidator) {
    if (validateNewPresentationDate && !intendedPresentationDate) {
      throw new DegreeCertificateBadRequestError(
        'La fecha de presentación es requerida',
      )
    }

    const degreeCertificateAttendance =
      await this.getDegreeCertificateAttendanceData(degreeId)
    const degreeCertificateData = await this.getDegreeCertificateData(
      degreeId,
      validateNewPresentationDate,
    )

    const attendanceAlreadyMarked = await this.dataSource.manager
      .createQueryBuilder(DegreeCertificateEntity, 'dc')
      .innerJoin('dc.attendances', 'dca')
      .innerJoin('dca.functionary', 'functionary')
      .where(
        'dc.presentationDate between :start and :end',
        this.getDateRangeValues(
          validateNewPresentationDate
            ? intendedPresentationDate
            : degreeCertificateData.presentationDate,
          degreeCertificateData.duration || 60,
        ),
      )
      .andWhere('functionary.id in (:...functionaryIds)', {
        functionaryIds: degreeCertificateAttendance.map(
          (dca) => dca.functionary.id,
        ),
      })
      .andWhere('dc.id != :dcId', {
        dcId: degreeCertificateData.id,
      })
      .andWhere('dc.isClosed = :isClosed', { isClosed: false })
      .andWhere('dc.deletedAt IS NULL')
      .getMany()

    if (attendanceAlreadyMarked.length > 0) {
      throw new DegreeCertificateBadRequestError(
        'Uno o más miembros del acta de grado se encuentran en otro consejo en la misma fecha. Por favor, verifique los datos e intente nuevamente.',
      )
    }
  }

  /**
   *
   * @param start Start date
   * @param duration Duration in minutes
   * @returns Start and end date
   */
  private getDateRangeValues(start: Date, duration: number) {
    return {
      start,
      end: new Date(new Date(start).getTime() + duration * 60 * 1000),
    }
  }
}
