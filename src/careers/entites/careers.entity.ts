import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base.entity'

@Entity('careers')
export class Career extends BaseAppEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
  })
  name: string

  @Column({
    name: 'credits',
  })
  credits: number

  @Column({
    name: 'men_degree',
  })
  menDegree: string

  @Column({
    name: 'women_degree',
  })
  womenDegree: string

  @Column({
    name: 'is_active',
  })
  isActive: boolean
}
