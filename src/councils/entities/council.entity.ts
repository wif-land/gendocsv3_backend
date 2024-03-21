import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base.entity'
import { CouncilType, ICouncil } from '../interfaces/council.interface'
import { ApiProperty } from '@nestjs/swagger'
import { ModuleEntity } from '../../modules/entities/modules.entity'
import { UserEntity } from '../../users/entities/users.entity'
import { SubmoduleYearModuleEntity } from '../../year-module/entities/submodule-year-module.entity'
import { CouncilAttendanceEntity } from './council-attendance.entity'

@Entity('councils')
export class CouncilEntity extends BaseAppEntity implements ICouncil {
  @ApiProperty({
    enum: CouncilType,
    enumName: 'CouncilType',
    description: 'Tipo de consejo',
  })
  @Column()
  type: CouncilType

  @ApiProperty({
    description: 'Fecha del consejo',
    example: '"2024-01-09T16:16:33.591Z"',
  })
  @Column()
  date: Date

  @ApiProperty({
    description: 'Nombre del consejo',
    example: 'Consejo 123',
  })
  @Column()
  name: string

  @ApiProperty({
    description: 'Describe si está activo o no',
    example: 'true',
  })
  @Column({ default: true, name: 'is_active' })
  isActive: boolean

  @ApiProperty({
    description: 'Describe si está archivado o no',
    example: 'true',
  })
  @Column({ default: false, name: 'is_archived' })
  isArchived: boolean

  @ApiProperty({
    example: 'xxxxxxxxxxxxxxxxxxxxx',
    description: 'Identificador único del directorio del proceso en drive',
  })
  @Column({
    name: 'drive_id',
    type: 'varchar',
    nullable: false,
  })
  driveId: string

  @ApiProperty({
    example: '1',
    description: 'Módulo asociado al consejo',
    type: () => ModuleEntity,
  })
  @ManyToOne(() => ModuleEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'module_id', referencedColumnName: 'id' })
  module: ModuleEntity

  @ApiProperty({
    example: '1',
    description: 'Usuario que crea el consejo',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity

  @ApiProperty({
    example: '2',
    description:
      'submodule_year_module al que pertenece el consejo para obtener el directorio padre de drive',
    type: () => SubmoduleYearModuleEntity,
  })
  @ManyToOne(() => SubmoduleYearModuleEntity, { nullable: false })
  @JoinColumn({ name: 'submodule_year_module_id' })
  submoduleYearModule: SubmoduleYearModuleEntity

  @OneToMany(
    () => CouncilAttendanceEntity,
    (councilAttendance) => councilAttendance.council,
    { eager: true },
  )
  attendance: CouncilAttendanceEntity[]
}
