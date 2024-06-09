import { Repository } from 'typeorm'
import { CouncilAttendanceEntity } from '../../councils/entities/council-attendance.entity'
import { BaseError } from '../../shared/utils/error'

export class ValidateMembersAvailability {
  constructor(
    private readonly councilAttendanceRepository: Repository<CouncilAttendanceEntity>,
    private readonly councilId: number,
    private readonly councilAttendanceId: number[],
  ) {}

  async execute() {
    const councilsThatHaveOverlap =
      await this.councilAttendanceRepository.query(
        `
        SELECT councils.id
        FROM council_attendance councils
        WHERE id IN (${this.councilAttendanceId.join(',')})
          AND councils.id != ${this.councilId}
          AND councils.date <= (
            SELECT councils.data
            FROM council_attendance
            WHERE council_attendance.id = ${this.councilId}
          )
        `,
      )

    console.log(councilsThatHaveOverlap)

    if (councilsThatHaveOverlap.length) {
      throw new ValidateMembersAvailabilityError()
    }
  }
}

class ValidateMembersAvailabilityError extends BaseError {
  constructor() {
    super(
      400,
      'council-attendance/validate-members-availability',
      'Error validando la disponibilidad de los miembros',
      'Ocurrió un error validando la disponibilidad de los miembros',
      'councilAttendance.errors.ValidateMembersAvailabilityError',
    )
  }
}
