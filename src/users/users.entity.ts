import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../shared/utils/base.entity'

@Entity({ name: 'users' })
export class User extends BaseAppEntity {
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
  password: string

  @Column({ type: 'simple-array' })
  roles: string[]

  @Column({ type: 'simple-array', nullable: true })
  platformPermission: string[]
}
