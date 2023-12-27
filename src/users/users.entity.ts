import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../shared/utils/base.entity'

@Entity()
export class User extends BaseAppEntity {
  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column()
  name: string

  @Column({ type: 'simple-array' })
  roles: string[]

  @Column({ type: 'simple-array', nullable: true })
  platformPermission: string[]
}
