import { Submodule } from '../../submodules/entities/submodule.entity'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base.entity'

@Entity('modules')
export class Module extends BaseAppEntity {
  @Column({
    name: 'code',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  code: string

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name: string

  @ManyToMany(() => Submodule, {
    eager: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'submodules_modules',
    joinColumn: { name: 'module_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'submodule_id', referencedColumnName: 'id' },
  })
  submodules?: Submodule[]
}
