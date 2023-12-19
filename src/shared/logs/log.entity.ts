import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../utils/base.entity'

@Entity()
export class Log extends BaseAppEntity {
  @Column({ type: 'text', nullable: true })
  body: string
  @Column({ type: 'text', nullable: true })
  headers: string
  @Column({ nullable: true })
  url: string
  @Column({ nullable: true })
  method: string
  @Column({ nullable: true })
  userAgent: string
  @Column({ nullable: true })
  ip: string
}
