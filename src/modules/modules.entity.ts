import { BaseAppEntity } from '../shared/utils/base.entity'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'modules' })
export class Module extends BaseAppEntity {
  @Column()
  code: string

  @Column()
  name: string
}
