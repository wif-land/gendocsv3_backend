import { Module } from '../../modules/entities/modules.entity'
import { User } from '../../users/entities/users.entity'
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users_access_modules')
export class UserAccessModule {
  @PrimaryColumn({
    name: 'user_id',
    type: 'int',
  })
  userId: number

  @PrimaryColumn({
    name: 'module_id',
    type: 'int',
  })
  moduleId: number

  @ManyToOne(() => User, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User[]

  @ManyToOne(() => Module, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'module_id',
    referencedColumnName: 'id',
  })
  module: Module[]

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date
}
