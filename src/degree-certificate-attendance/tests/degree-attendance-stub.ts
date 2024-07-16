import { DegreeCertificateAttendanceEntity } from '../entities/degree-certificate-attendance.entity'
import { DEGREE_ATTENDANCE_ROLES } from '../../shared/enums/degree-certificates'
import { DegreeCertificateStub } from '../../degree-certificates/tests/degree-certificate-stub'
import { FunctionaryStub } from '../../functionaries/tests/functionary-stub'
import { BaseStub } from '../../shared/utils/test/base-stub'

export class DegreeAttendanceStub extends BaseStub {
  id: number
  role: DEGREE_ATTENDANCE_ROLES
  details: string
  assignationDate: Date
  hasAttended: boolean
  hasBeenNotified: boolean
  degreeCertificate: DegreeCertificateStub
  functionary: FunctionaryStub

  constructor(props: Partial<DegreeCertificateAttendanceEntity> = {}) {
    super()

    this.id = props.id ?? BaseStub.getRandomId()
    this.role = props.role ?? BaseStub.getRandomEnum(DEGREE_ATTENDANCE_ROLES)
    this.details = props.details ?? BaseStub.getRandomString()
    this.assignationDate = props.assignationDate ?? BaseStub.getRandomDate()
    this.hasAttended = props.hasAttended ?? BaseStub.getRandomBoolean()
    this.hasBeenNotified = props.hasBeenNotified ?? BaseStub.getRandomBoolean()
    this.functionary = props.functionary ?? new FunctionaryStub()
    this.degreeCertificate =
      props.degreeCertificate ?? new DegreeCertificateStub()
  }
}
