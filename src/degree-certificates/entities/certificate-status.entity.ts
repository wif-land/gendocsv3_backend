import { Column, Entity, OneToMany } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { DegreeCertificateEntity } from './degree-certificate.entity'
import { CertificateTypeStatusEntity } from './certificate-type-status.entity'

@Entity('certificate_status')
export class CertificateStatusEntity extends BaseAppEntity {
  @Column({
    name: 'code',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  code: string

  @Column({
    name: 'male_name',
    type: 'varchar',
    length: 100,
  })
  maleName: string

  @Column({
    name: 'female_name',
    type: 'varchar',
    length: 100,
  })
  femaleName: string

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean

  @OneToMany(
    () => DegreeCertificateEntity,
    (degreeCertificate) => degreeCertificate.certificateStatus,
  )
  degreeCertificates: DegreeCertificateEntity[]

  @OneToMany(
    () => CertificateTypeStatusEntity,
    (certificateTypeStatus) => certificateTypeStatus.certificateStatus,
  )
  certificateTypeStatuses: CertificateTypeStatusEntity[]
}
