import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { StudentEntity } from '../../students/entities/student.entity'
import { CareerEntity } from '../../careers/entites/careers.entity'
import { CertificateTypeEntity } from './certificate-type.entity'
import { CertificateStatusEntity } from './certificate-status.entity'
import { DegreeModalityEntity } from './degree-modality.entity'
import { RoomEntity } from './room.entity'
import { SubmoduleYearModuleEntity } from '../../year-module/entities/submodule-year-module.entity'
import { UserEntity } from '../../users/entities/users.entity'
import { DegreeCertificateAttendanceEntity } from '../../degree-certificate-attendance/entities/degree-certificate-attendance.entity'

@Entity('degree_certificates')
export class DegreeCertificateEntity extends BaseAppEntity {
  @Column({
    name: 'number',
    type: 'int',
    nullable: true,
  })
  number?: number

  @Column({
    name: 'aux_number',
    type: 'int',
    nullable: true,
  })
  auxNumber?: number

  @Column({
    name: 'topic',
    type: 'varchar',
  })
  topic: string

  @Column({
    name: 'presentation_date',
    nullable: true,
    type: 'timestamptz',
  })
  presentationDate?: Date

  @ManyToOne(() => StudentEntity, (student) => student.degreeCertificates, {
    eager: false,
  })
  @JoinColumn({
    name: 'student_id',
    referencedColumnName: 'id',
  })
  student: StudentEntity

  @ManyToOne(() => CareerEntity)
  @JoinColumn({
    name: 'career_id',
    referencedColumnName: 'id',
  })
  career: CareerEntity

  @ManyToOne(
    () => CertificateTypeEntity,
    (certificateType) => certificateType.degreeCertificates,
    { eager: true },
  )
  @JoinColumn({
    name: 'certificate_type_id',
    referencedColumnName: 'id',
  })
  certificateType: CertificateTypeEntity

  @ManyToOne(
    () => CertificateStatusEntity,
    (certificateStatus) => certificateStatus.degreeCertificates,
    { eager: true, nullable: true },
  )
  @JoinColumn({
    name: 'certificate_status_id',
    referencedColumnName: 'id',
  })
  certificateStatus?: CertificateStatusEntity

  @ManyToOne(
    () => DegreeModalityEntity,
    (degreeModality) => degreeModality.degreeCertificates,
    { eager: true },
  )
  @JoinColumn({
    name: 'degree_modality_id',
    referencedColumnName: 'id',
  })
  degreeModality: DegreeModalityEntity

  @ManyToOne(() => RoomEntity, (room) => room.degreeCertificates, {
    nullable: true,
  })
  @JoinColumn({
    name: 'room_id',
    referencedColumnName: 'id',
  })
  room?: RoomEntity

  @Column({
    name: 'duration',
    type: 'int',
    nullable: true,
  })
  duration?: number

  @Column({
    name: 'link',
    type: 'varchar',
    nullable: true,
  })
  link?: string

  @Column({
    name: 'change_university_resolution',
    type: 'varchar',
    nullable: true,
  })
  changeUniversityResolution?: string

  @Column({
    name: 'change_university_name',
    type: 'text',
    nullable: true,
  })
  changeUniversityName?: string

  @Column({
    name: 'change_university_date',
    type: 'timestamptz',
    nullable: true,
  })
  changeUniversityDate?: Date

  @ManyToOne(
    () => SubmoduleYearModuleEntity,
    (submoduleYearModule) => submoduleYearModule.degreeCertificates,
  )
  @JoinColumn({
    name: 'submodule_year_module_id',
    referencedColumnName: 'id',
  })
  submoduleYearModule: SubmoduleYearModuleEntity

  @Column({
    name: 'grades_sheet_drive_id',
    type: 'varchar',
    nullable: true,
  })
  gradesSheetDriveId?: string

  @Column({
    name: 'certificate_drive_id',
    type: 'varchar',
    nullable: true,
  })
  certificateDriveId?: string

  @Column({
    name: 'deleted_at',
    type: 'timestamp without time zone',
    nullable: true,
  })
  deletedAt: Date

  @Column({
    name: 'is_closed',
    type: 'boolean',
    default: false,
  })
  isClosed: boolean

  @ManyToOne(() => UserEntity, (user) => user.degreeCertificates)
  @JoinColumn({
    name: 'created_by',
  })
  user: UserEntity

  @OneToMany(
    () => DegreeCertificateAttendanceEntity,
    (attendance) => attendance.degreeCertificate,
  )
  attendances: DegreeCertificateAttendanceEntity[]
}
