import { Column } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'

export class CertificateTypeEntity extends BaseApp {
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
    unique: true,
  })
  name: string
}
