import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { UserEntity } from '../../users/entities/users.entity'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { NotificationStatus } from '../../shared/enums/notification-status'
import { ScopeInterface } from '../../shared/interfaces/scope-notification'

@Entity('notifications')
export class NotificationEntity extends BaseAppEntity {
  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string

  @Column({ name: 'type', type: 'varchar', nullable: false })
  type: string

  @Column({ name: 'messages', type: 'simple-array', nullable: true })
  messages: string[]

  @Column({
    name: 'status',
    type: 'enum',
    enum: NotificationStatus,
    nullable: false,
  })
  status: NotificationStatus

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data?: string

  @Column({ name: 'scope', type: 'jsonb', nullable: true })
  scope?: ScopeInterface

  @Column({ name: 'is_main', type: 'bool', default: false })
  isMain: boolean

  @Column({ name: 'retry_id', type: 'int', nullable: true, default: null })
  retryId?: number

  @Column({ name: 'parent_id', type: 'bigint', nullable: true })
  parentId?: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: UserEntity
}
