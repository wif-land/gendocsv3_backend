import { BaseError, IError } from '../../shared/utils/error'

export class StudentError extends BaseError {
  constructor({
    statuscode,
    type = 'Error en el servicio de estudiantes',
    title = 'Error en el servicio de estudiantes',
    detail,
    instance,
  }: IError) {
    super(
      statuscode,
      `students/${type}`,
      title,
      detail || 'Un error ha ocurrido en el servicio de estudiantes',
      instance || 'students.errors.StudentError',
    )
  }
}
