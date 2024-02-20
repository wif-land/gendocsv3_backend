import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Process } from '../../processes/entities/process.entity'
import { UserEntity } from '../../users/entities/users.entity'
import { DocumentEntity } from '../../documents/entities/document.entity'

@Entity('templates_processes')
export class TemplateProcess extends BaseApp {
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
    example: 'Id del drive',
    description: 'Identificador único del drive',
  })
  @Column({
    name: 'drive_id',
    type: 'varchar',
  })
  driveId: string

  @ApiProperty({
    example: 'true',
    description: 'Indica si la plantilla tiene estudiante',
  })
  @Column({
    name: 'has_student',
    type: 'boolean',
  })
  hasStudent: boolean

  @ApiProperty({
    example: 'true',
    description: 'Indica si la plantilla tiene funcionarios',
  })
  @Column({
    name: 'has_functionary',
    type: 'boolean',
  })
  hasFunctionary: boolean

  @ApiProperty({
    example: '1',
    description: 'Proceso asociado a la plantilla',
    type: () => Process,
  })
  @ManyToOne(() => Process, { eager: true, nullable: false })
  @JoinColumn({ name: 'process_id' })
  process: Process

  @ApiProperty({
    example: '1',
    description: 'Usuario asociado a la plantilla',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @OneToMany(() => DocumentEntity, (document) => document.templateProcess)
  documents: DocumentEntity[]
}
