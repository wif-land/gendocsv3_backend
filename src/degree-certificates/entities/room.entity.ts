import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'

@Entity('rooms')
export class RoomEntity extends BaseAppEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name: string

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean
}
