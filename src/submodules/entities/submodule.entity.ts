import { BaseApp } from '../../shared/entities/base-app.entity'
import { Column, Entity } from 'typeorm'

@Entity('submodules')
export class Submodule extends BaseApp {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string
}
