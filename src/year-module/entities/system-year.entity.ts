import { Column, Entity } from 'typeorm'

@Entity('system_year')
export class SystemYearEntity {
  @Column('int', { primary: true, name: 'year' })
  currentYear: number
}
