import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { RolesType } from '../../auth/decorators/roles-decorator'
import { Module } from '../../modules/entities/modules.entity'
import { BasePerson } from '../../shared/entities/base-person.entity'

@Entity('users')
export class User extends BasePerson {
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
  })
  password: string

  @Column({
    name: 'roles',
    type: 'simple-array',
  })
  roles: RolesType[]

  @Column({
    name: 'platform_permission',
    type: 'simple-array',
    nullable: true,
  })
  platformPermission?: string[]

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean

  @ManyToMany(() => Module, {
    eager: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'users_access_modules',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'module_id', referencedColumnName: 'id' },
  })
  accessModules?: Module[]
}
