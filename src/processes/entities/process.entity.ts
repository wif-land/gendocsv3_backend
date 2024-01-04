import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { User } from '../../users/entities/users.entity'
import { Module } from '../../modules/entities/modules.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('processes')
export class Process extends BaseApp {
  @ApiProperty({
    example: 'Proceso de prueba',
    description: 'Nombre del proceso',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string

  @ApiProperty({
    example: 'En proceso',
    description: 'Estado del proceso',
  })
  @Column({
    name: 'state',
    type: 'varchar',
  })
  state: string

  @ApiProperty({
    example: 'Id del drive',
    description: 'Identificador único del drive',
  })
  @Column({
    name: 'drive_id',
    type: 'varchar',
  })
  driveId: string

  @ApiProperty({
    example: true,
    description: 'Estado del proceso',
    default: true,
  })
  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean

  @ApiProperty({
    description: 'Usuario asociado al proceso',
    type: () => User,
  })
  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ApiProperty({
    description: 'Módulo asociado al proceso',
    type: () => Module,
  })
  @ManyToOne(() => Module, { eager: true, nullable: false })
  @JoinColumn({ name: 'module_id' })
  module: Module
}
