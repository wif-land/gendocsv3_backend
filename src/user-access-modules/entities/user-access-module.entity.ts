import { Module } from '../../modules/modules.entity'
import { User } from '../../users/users.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity({ name: 'user_access_modules' })
export class UserAccessModule {
  @PrimaryColumn({ name: 'user_id' })
  userId: number

  @PrimaryColumn({ name: 'module_id' })
  moduleId: number

  @ManyToOne(() => User, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User[]

  @ManyToOne(() => Module, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'module_id', referencedColumnName: 'id' })
  module: Module[]
}
