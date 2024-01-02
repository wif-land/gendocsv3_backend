import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BaseAppEntity } from '../shared/utils/base.entity'
import { RolesType } from '../auth/roles-decorator'
import { Module } from '../modules/modules.entity'

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

  @ManyToMany(() => Module, {
    eager: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'user_access_modules',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'module_id', referencedColumnName: 'id' },
  })
  accessModules?: Module[]
}
