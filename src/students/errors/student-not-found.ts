import { StudentError } from './student-error'

export class StudentNotFoundError extends StudentError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 404,
      type: 'not-found',
      title: 'Estudiante no encontrado',
      detail: detail || 'El estudiante no ha sido encontrado',
      instance: instance || 'students.errors.StudentNotFoundError',
    })
  }
}
