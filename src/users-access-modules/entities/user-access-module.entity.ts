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
  })
  userId: number

  @PrimaryColumn({
    name: 'module_id',
  })
  moduleId: number

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User[]

  @ManyToOne(() => Module, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
