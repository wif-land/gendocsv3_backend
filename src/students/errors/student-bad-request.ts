import { StudentError } from './student-error'

export class StudentBadRequestError extends StudentError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 400,
      type: 'bad-request',
      title: 'Error en la petición del estudiante',
      detail: detail || 'La petición del estudiante es incorrecta',
      instance: instance || 'students.errors.StudentBadRequestError',
    })
  }
}
