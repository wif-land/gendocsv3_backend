import { DataSource } from 'typeorm'
import { Validator } from '../../core/validator'

export interface IDegreeThatOverlapValidator {
  degreeId: number
  functionaryId: number
  role: string
}

/**
 * Validates if a new member of the degree certificate already exists in another degree certificate at the same date
 *
 */
export class DegreeAttendanceThatOverlapValidator extends Validator<IDegreeThatOverlapValidator> {
  constructor(dataSource: DataSource) {
    super('', dataSource)
  }

  /**
   * Validates if the degree certificate overlaps with another degree certificate
   *
   * @param {IDegreeThatOverlapValidator} data - Data to validate
   * @param {number} data.degreeId - Degree certificate id
   * @param {boolean} data.validateNewPresentationDate - true if the degree certificate will have a new presentation date
   * @param {Date} data.intendedPresentationDate - Intended presentation date
   */
  public async validate({ degreeId }: IDegreeThatOverlapValidator) {
    console.log({ degreeId })
    // regla de negocio
    // si un miembro del acta entra como miembro supplete en la acta actual, se debe validar que no esté en otra acta en la misma fecha con cualquier rol

    // if (attendanceAlreadyMarked.length > 0) {
    //   throw new DegreeCertificateBadRequestError(
    //     'Uno o más miembros del acta de grado se encuentran en otro consejo en la misma fecha. Por favor, verifique los datos e intente nuevamente.',
    //   )
    // }
  }
}
