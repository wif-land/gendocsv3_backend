import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
export class BaseApp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  // @BeforeInsert()
  // beforeInsert(): void {
  //   const date = new Date().getTime()
  //   this.createdAt = date
  //   this.updatedAt = date
  // }

  // @BeforeUpdate()
  // beforeUpdate(): void {
  //   this.updatedAt = new Date().getTime()
  // }
}
