import { Column, Entity, OneToMany } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { DegreeCertificateEntity } from './degree-certificate.entity'
import { CellsGradeDegreeCertificateTypeEntity } from './cells-grade-degree-certificate-type.entity'
import { CertificateTypeCareerEntity } from './certicate-type-career.entity'
import { CertificateTypeStatusEntity } from './certificate-type-status.entity'

@Entity('certificate_types')
export class CertificateTypeEntity extends BaseAppEntity {
  @Column({
    name: 'code',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  code: string

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name: string

  @Column({
    name: 'drive_id',
    type: 'varchar',
    unique: true,
  })
  driveId: string

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean

  @OneToMany(
    () => DegreeCertificateEntity,
    (degreeCertificate) => degreeCertificate.certificateType,
  )
  degreeCertificates: DegreeCertificateEntity[]

  @OneToMany(
    () => CellsGradeDegreeCertificateTypeEntity,
    (cellsGradeDegreeCertificateType) =>
      cellsGradeDegreeCertificateType.certificateType,
  )
  cellsGradeDegreeCertificateTypes: CellsGradeDegreeCertificateTypeEntity[]

  @OneToMany(
    () => CertificateTypeCareerEntity,
    (certificateTypeCareer) => certificateTypeCareer.certificateType,
  )
  certificateTypeCareers: CertificateTypeCareerEntity[]

  @OneToMany(
    () => CertificateTypeStatusEntity,
    (certificateTypeStatus) => certificateTypeStatus.certificateType,
  )
  certificateTypeStatuses: CertificateTypeStatusEntity[]
}
