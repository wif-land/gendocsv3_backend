import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../shared/utils/base.entity'

@Entity()
export class User extends BaseAppEntity {
  @Column({ unique: true })
  dni: string

  @Column()
  firstName: string

  @Column()
  secondName: string

  @Column()
  firstLastName: string

  @Column()
  secondLastName: string

  @Column({ unique: true })
  outlookEmail: string

  @Column({ unique: true })
  googleEmail: string

  @Column()
  phone: string

  @Column()
  regularPhone: string

  @Column()
  password: string

  @Column({ type: 'simple-array' })
  roles: string[]

  @Column({ type: 'simple-array', nullable: true })
  platformPermission: string[]
}
