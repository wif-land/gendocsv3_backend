import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ICareer } from '../interfaces/career.interface'
import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'

@Entity('careers')
export class Career extends BaseAppEntity implements ICareer {
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

  @Column({
    name: 'internship_hours',
  })
  internshipHours: number

  @Column({
    name: 'vinculation_hours',
  })
  vinculationHours: number

  @ManyToOne(() => FunctionaryEntity, (functionary) => functionary.careers, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({
    name: 'coordinator_id',
    referencedColumnName: 'id',
  })
  coordinator: FunctionaryEntity
}
