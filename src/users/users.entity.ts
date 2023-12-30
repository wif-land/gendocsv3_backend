import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../shared/utils/base.entity'
import { RolesType } from '../auth/roles-decorator'

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
  roles: RolesType[]

  @Column({ type: 'simple-array', nullable: true })
  platformPermission: string[]

  @Column({ default: true })
  isActive: boolean
}
