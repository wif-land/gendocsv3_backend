import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../../entities/base-app.entity'

@Entity('logs')
export class Log extends BaseAppEntity {
  @Column({
    name: 'body',
    type: 'text',
    nullable: true,
  })
  body: string

  @Column({
    name: 'headers',
    type: 'text',
    nullable: true,
  })
  headers: string

  @Column({
    name: 'url',
    nullable: true,
  })
  url: string

  @Column({
    name: 'method',
    nullable: true,
  })
  method: string

  @Column({
    name: 'user_agent',
    nullable: true,
  })
  userAgent: string

  @Column({
    name: 'ip',
    nullable: true,
  })
  ip: string
}
