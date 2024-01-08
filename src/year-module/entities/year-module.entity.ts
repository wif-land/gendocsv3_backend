import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Module } from '../../modules/entities/modules.entity'
import { SubmoduleYearModule } from './submodule-year-module.entity'

@Entity('year_module')
export class YearModule extends BaseApp {
  @ApiProperty({
    example: '2021',
    description: 'Año actual asociado al módulo',
  })
  @Column({
    name: 'year',
    type: 'int',
  })
  year: number

  @ApiProperty({
    example: '1CaoxnBvp8XGq02sXR5oD0-RLxJHcA4WSthA9yREjkDo',
    description: 'Id del directorio de drive del año',
  })
  @Column({
    name: 'drive_id',
    type: 'varchar',
  })
  driveId: string

  @ApiProperty({
    example: true,
    description: 'Estado del año',
    default: true,
  })
  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean

  @ApiProperty({
    example: '1',
    description: 'Módulo asociado al año',
    type: () => Module,
  })
  @ManyToOne(() => Module, { eager: true, nullable: false })
  @JoinColumn({ name: 'module_id' })
  module: Module

  @OneToMany(
    () => SubmoduleYearModule,
    (submoduleYearModule) => submoduleYearModule.yearModule,
  )
  submoduleYearModules: SubmoduleYearModule[]
}
