import { Column, Entity } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'

@Entity('degrees')
export class DegreeEntity extends BaseApp {
  @Column({
    name: 'abbreviation',
    type: 'varchar',
  })
  abbreviation: string

  @Column({
    name: 'male_title',
    type: 'varchar',
  })
  maleTitle: string

  @Column({
    name: 'female_title',
    type: 'varchar',
  })
  femaleTitle: string

  @Column({
    name: 'degree_type',
    type: 'char',
    length: 1,
  })
  degreeLevel: string
}
