import { Submodule } from '../../submodules/entities/submodule.entity'
import { BaseAppEntity } from '../../shared/utils/base.entity'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

@Entity({ name: 'modules' })
export class Module extends BaseAppEntity {
  @Column()
  code: string

  @Column()
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
