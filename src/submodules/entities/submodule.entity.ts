import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base.entity'

@Entity('submodules')
export class Submodule extends BaseAppEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string
}
