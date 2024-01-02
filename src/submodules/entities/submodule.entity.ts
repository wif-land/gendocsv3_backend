import { BaseAppEntity } from '../../shared/utils/base.entity'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'submodules' })
export class Submodule extends BaseAppEntity {
  @Column()
  name: string
}
