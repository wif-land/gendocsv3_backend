import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { CertificateTypeEntity } from './certificate-type.entity'
import { CareerEntity } from '../../careers/entites/careers.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('certificate-type-career')
export class CertificateTypeCareerEntity extends BaseAppEntity {
  @ManyToOne(
    () => CertificateTypeEntity,
    (certificateType) => certificateType.certificateTypeCareers,
  )
  @ApiProperty({
    type: () => CertificateTypeEntity,
  })
  @JoinColumn({ name: 'certificate_type_id' })
  certificateType: CertificateTypeEntity

  @ManyToOne(() => CareerEntity)
  @ApiProperty({
    type: () => CareerEntity,
  })
  @JoinColumn({ name: 'carrer_id' })
  carrer: CareerEntity
}
