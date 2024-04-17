import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'

@Entity('submodules')
export class SubmoduleEntity extends BaseAppEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string
}
