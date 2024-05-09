import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { CertificateTypeEntity } from './certificate-type.entity'
import { CertificateStatusEntity } from './certificate-status.entity'

@Entity('certificate_type_status')
export class CertificateTypeStatusEntity extends BaseAppEntity {
  @ManyToOne(() => CertificateTypeEntity)
  @JoinColumn({ name: 'certificate_type_id' })
  certificateType: CertificateTypeEntity

  @ManyToOne(() => CertificateStatusEntity)
  @JoinColumn({ name: 'certificate_status_id' })
  certificateStatus: CertificateStatusEntity

  @Column({
    name: 'drive_id',
    type: 'varchar',
    unique: true,
  })
  driveId: string
}
