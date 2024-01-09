import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base.entity'
import {
  CouncilAttendanceRole,
  ICouncilAttendance,
} from '../interfaces/council-attendance.interface'
import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { CouncilEntity } from './council.entity'

@Entity('council_attendance')
export class CouncilAttendanceEntity
  extends BaseAppEntity
  implements ICouncilAttendance
{
  @Column({
    name: 'has_attended',
    type: 'boolean',
    default: false,
  })
  hasAttended: boolean

  @Column({
    name: 'has_been_notified',
    type: 'boolean',
    default: false,
  })
  hasBeenNotified: boolean

  @Column({
    type: 'enum',
    enum: CouncilAttendanceRole,
    default: CouncilAttendanceRole.MEMBER,
  })
  role: CouncilAttendanceRole

  @ManyToOne(() => CouncilEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'council_id',
    referencedColumnName: 'id',
  })
  council: CouncilEntity

  @ManyToOne(() => FunctionaryEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'functionary_id',
    referencedColumnName: 'id',
  })
  functionary: FunctionaryEntity
}
