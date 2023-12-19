import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'
export class BaseAppEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
  @Index()
  @Column({ type: 'bigint' })
  createdAt: number
  @Column({ type: 'bigint' })
  updatedAt: number
  @BeforeInsert()
  beforeInsert(): void {
    const date = new Date().getTime()
    this.createdAt = date
    this.updatedAt = date
  }
  @BeforeUpdate()
  beforeUpdate(): void {
    this.updatedAt = new Date().getTime()
  }
}
