import { Column, Entity } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'

@Entity('rooms')
export class RoomEntity extends BaseApp {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name: string
}
