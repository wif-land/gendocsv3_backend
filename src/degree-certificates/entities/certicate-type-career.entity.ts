import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { CertificateTypeEntity } from './certificate-type.entity'
import { CareerEntity } from '../../careers/entites/careers.entity'

@Entity('certificate-type-career')
export class CertificateTypeCareerEntity extends BaseAppEntity {
  @ManyToOne(
    () => CertificateTypeEntity,
    (certificateType) => certificateType.certificateTypeCareers,
  )
  @JoinColumn({ name: 'certificate_type_id' })
  certificateType: CertificateTypeEntity

  @ManyToOne(() => CareerEntity)
  @JoinColumn({ name: 'career_id' })
  career: CareerEntity
}
