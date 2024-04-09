import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { StudentEntity } from '../../students/entities/student.entity'
import { Career } from '../../careers/entites/careers.entity'
import { CertificateTypeEntity } from './certificate-type.entity'
import { CertificateStatusEntity } from './certificate-status.entity'
import { DegreeModalityEntity } from './degree-modality.entity'
import { RoomEntity } from './room.entity'

@Entity('degree_certificates')
export class DegreeCertificateEntity extends BaseAppEntity {
  @Column({
    name: 'number',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  number: string

  @Column({
    name: 'aux_number',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  auxNumber: string

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
}
