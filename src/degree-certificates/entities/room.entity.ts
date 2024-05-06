import { Column, Entity, OneToMany } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { DegreeCertificateEntity } from './degree-certificate.entity'

@Entity('rooms')
export class RoomEntity extends BaseAppEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name: string

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean

  @OneToMany(
    () => DegreeCertificateEntity,
    (degreeCertificate) => degreeCertificate.room,
  )
  degreeCertificates: DegreeCertificateEntity[]
}
