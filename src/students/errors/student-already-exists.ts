import { StudentError } from './student-error'

export class StudentAlreadyExist extends StudentError {
  constructor(detail: string, instance?: string) {
    super({
      statuscode: 409,
      type: 'already-exist',
      title: 'Estudiante ya existente',
      detail:
        detail || 'El estudiante ya se encuentra registrado en el sistema',
      instance: instance || 'students.errors.StudentAlreadyExist',
    })
  }
}
