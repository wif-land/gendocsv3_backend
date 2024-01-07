import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Process } from '../../processes/entities/process.entity'
// import { User } from '../../users/entities/users.entity'

@Entity('templates')
export class Template extends BaseApp {
  @ApiProperty({
    example: 'Plantilla de prueba',
    description: 'Nombre de la plantilla',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string

  @ApiProperty({
    example: 'En proceso',
    description: 'Estado de la plantilla',
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
    description: 'Estado de la plantilla',
    default: true,
  })
  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean

  @ApiProperty({
    description: 'Proceso asociado a la plantilla',
    type: () => Process,
  })
  @ManyToOne(() => Process, { eager: true, nullable: false })
  @JoinColumn({ name: 'process_id' })
  process: Process

  // @ApiProperty({
  //   description: 'Usuario asociado a la plantilla',
  //   type: () => User,
  // })
  // @ManyToOne(() => User, { eager: true, nullable: false })
  // @JoinColumn({ name: 'user_id' })
  // user: User
}
