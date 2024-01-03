import { Module } from '../../modules/entities/modules.entity'
import { Submodule } from '../../submodules/entities/submodule.entity'
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('submodules_modules')
export class SubmodulesModule {
  @PrimaryColumn({
    name: 'submodule_id',
    type: 'int',
  })
  submoduleId: number

  @PrimaryColumn({
    name: 'module_id',
    type: 'int',
  })
  moduleId: number

  @ManyToOne(() => Submodule, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'submodule_id',
    referencedColumnName: 'id',
  })
  submodule: Submodule[]

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
