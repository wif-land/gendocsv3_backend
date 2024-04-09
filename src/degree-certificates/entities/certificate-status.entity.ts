import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'

@Entity('certificate_status')
export class CertificateStatusEntity extends BaseAppEntity {
  @Column({
    name: 'code',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  code: string

  @Column({
    name: 'male_name',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  maleName: string

  @Column({
    name: 'female_name',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  femaleName: string
}
