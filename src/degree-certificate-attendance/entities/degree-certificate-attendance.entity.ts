import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { DegreeCertificateEntity } from '../../degree-certificates/entities/degree-certificate.entity'
import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { DEGREE_ATTENDANCE_ROLES } from '../../shared/enums/degree-certificates'

@Entity('degree_certificate_attendance')
export class DegreeCertificateAttendanceEntity extends BaseAppEntity {
  @Column({
    name: 'role',
    enum: DEGREE_ATTENDANCE_ROLES,
  })
  role: DEGREE_ATTENDANCE_ROLES

  @Column({
    name: 'details',
  })
  details: string

  @Column({
    name: 'assignation_date',
    type: 'date',
  })
  assignationDate: Date

  @Column({
    name: 'has_attended',
    type: 'boolean',
    default: false,
  })
  hasAttended: boolean

  @Column({
    name: 'has_been_notified',
    type: 'boolean',
    default: false,
  })
  hasBeenNotified: boolean

  @ManyToOne(() => DegreeCertificateEntity, {
    eager: true,
  })
  @JoinColumn({
    name: 'degree_certificate_id',
    referencedColumnName: 'id',
  })
  degreeCertificate: DegreeCertificateEntity

  @ManyToOne(() => FunctionaryEntity, {
    eager: true,
  })
  @JoinColumn({
    name: 'functionary_id',
    referencedColumnName: 'id',
  })
  functionary: FunctionaryEntity
}
