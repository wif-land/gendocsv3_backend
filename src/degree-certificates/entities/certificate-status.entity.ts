import { Column } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'

export class CertificateStatusEntity extends BaseApp {
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
