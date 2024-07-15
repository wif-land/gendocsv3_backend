import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
export class BaseAppEntity extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'Identificador único',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Fecha de creación',
    uniqueItems: true,
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
  })
  createdAt: Date

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Fecha de actualización',
    uniqueItems: true,
  })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date
}
