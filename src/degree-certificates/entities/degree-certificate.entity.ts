import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { StudentEntity } from '../../students/entities/student.entity'
import { Career } from '../../careers/entites/careers.entity'
import { CertificateTypeEntity } from './certificate-type.entity'
import { CertificateStatusEntity } from './certificate-status.entity'
import { DegreeModalityEntity } from './degree-modality.entity'
import { RoomEntity } from './room.entity'
import { SubmoduleYearModuleEntity } from '../../year-module/entities/submodule-year-module.entity'

@Entity('degree_certificates')
export class DegreeCertificateEntity extends BaseAppEntity {
  @Column({
    name: 'number',
    type: 'int',
  })
  number: number

  @Column({
    name: 'aux_number',
    type: 'int',
  })
  auxNumber: number

  @Column({
    name: 'topic',
    type: 'varchar',
  })
  topic: string

  @Column({
    name: 'presentation_date',
    type: 'date',
  })
  presentationDate: Date

  @ManyToOne(() => StudentEntity, {
    eager: true,
  })
  @JoinColumn({
    name: 'student_id',
    referencedColumnName: 'id',
  })
  student: StudentEntity

  @ManyToOne(() => Career, {
    eager: true,
  })
  @JoinColumn({
    name: 'career_id',
    referencedColumnName: 'id',
  })
  career: Career

  @ManyToOne(() => CertificateTypeEntity)
  @JoinColumn({
    name: 'certificate_type_id',
    referencedColumnName: 'id',
  })
  certificateType: CertificateTypeEntity

  @ManyToOne(() => CertificateStatusEntity)
  @JoinColumn({
    name: 'certificate_status_id',
    referencedColumnName: 'id',
  })
  certificateStatus: CertificateStatusEntity

  @ManyToOne(() => DegreeModalityEntity)
  @JoinColumn({
    name: 'degree_modality_id',
    referencedColumnName: 'id',
  })
  degreeModality: DegreeModalityEntity

  @ManyToOne(() => RoomEntity)
  @JoinColumn({
    name: 'room_id',
    referencedColumnName: 'id',
  })
  room: RoomEntity

  @Column({
    name: 'duration',
    type: 'int',
  })
  duration: number

  @Column({
    name: 'link',
    type: 'varchar',
  })
  link: string

  @ManyToOne(() => SubmoduleYearModuleEntity)
  @JoinColumn({
    name: 'submodule_year_module_id',
    referencedColumnName: 'id',
  })
  submoduleYearModule: SubmoduleYearModuleEntity

  @Column({
    name: 'grades_sheet_drive_id',
    type: 'varchar',
  })
  gradesSheetDriveId: string

  @Column({
    name: 'document_drive_id',
    type: 'varchar',
  })
  documentDriveId: string

  @Column({
    name: 'certificate_drive_id',
    type: 'varchar',
  })
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
}
