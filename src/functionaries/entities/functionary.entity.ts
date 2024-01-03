import { Column, Entity } from 'typeorm'
import { BasePerson } from '../../shared/entities/base-person.entity'

@Entity('functionaries')
export class Functionary extends BasePerson {
  @Column({
    name: 'dni',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  dni: string

  @Column({
    name: 'second_level_degree',
    type: 'varchar',
    length: 255,
  })
  secondLevelDegree: string

  @Column({
    name: 'third_level_degree',
    type: 'varchar',
    length: 255,
  })
  thirdLevelDegree: string

  @Column({
    name: 'fourth_level_degree',
    type: 'varchar',
    length: 255,
  })
  fourthLevelDegree: string
}
