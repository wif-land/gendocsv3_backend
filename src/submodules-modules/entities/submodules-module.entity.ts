import { Module } from '../../modules/entities/modules.entity'
import { Submodule } from '../../submodules/entities/submodule.entity'
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity({ name: 'submodules_modules' })
export class SubmodulesModule {
  @PrimaryColumn({ name: 'submodule_id' })
  submoduleId: number

  @PrimaryColumn({ name: 'module_id' })
  moduleId: number

  @ManyToOne(() => Submodule, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'submodule_id', referencedColumnName: 'id' })
  submodule: Submodule[]

  @ManyToOne(() => Module, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'module_id', referencedColumnName: 'id' })
  module: Module[]
}
