import { ApiProperty } from '@nestjs/swagger'
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
export class BaseApp extends BaseEntity {
  @ApiProperty({
    example: 'd3201b6d-5a8c-4fb8-87fc-b39c90fd967e',
    description: 'Identificador único',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Fecha de creación',
    uniqueItems: true,
  })
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Fecha de actualización',
    uniqueItems: true,
  })
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date
}
