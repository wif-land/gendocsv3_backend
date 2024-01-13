import { Column, Entity, OneToMany } from 'typeorm'
import { BasePerson } from '../../shared/entities/base-person.entity'
import { ApiProperty } from '@nestjs/swagger'
import { CouncilAttendanceEntity } from '../../councils/entities/council-attendance.entity'
import { Position } from '../../positions/entities/position.entity'
import { DocumentFunctionaryEntity } from '../../documents/entities/document-functionary.entity'

@Entity('functionaries')
export class FunctionaryEntity extends BasePerson {
  @ApiProperty({
    example: '070747643',
    description: 'Cédula de identidad',
    uniqueItems: true,
  })
  @Column({
    name: 'dni',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  dni: string

  @ApiProperty({
    example: 'Bachillerato General',
    description: 'Segundo nivel de educación',
  })
  @Column({
    name: 'second_level_degree',
    type: 'varchar',
    length: 255,
  })
  secondLevelDegree: string

  @ApiProperty({
    example: 'Ingeniería en Sistemas',
    description: 'Tecer nivel de educación',
  })
  @Column({
    name: 'third_level_degree',
    type: 'varchar',
    length: 255,
  })
  thirdLevelDegree: string

  @ApiProperty({
    example: 'Maestría en Sistemas',
    description: 'Cuarto nivel de educación',
  })
  @Column({
    name: 'fourth_level_degree',
    type: 'varchar',
    length: 255,
  })
  fourthLevelDegree: string

  @ApiProperty({
    example: true,
    description: 'Estado del funcionario',
    default: true,
  })
  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean

  @ApiProperty({
    type: () => CouncilAttendanceEntity,
    isArray: true,
  })
  @OneToMany(
    () => CouncilAttendanceEntity,
    (councilAttendance) => councilAttendance.functionary,
  )
  councilAttendance: CouncilAttendanceEntity[]

  @ApiProperty({
    type: () => Position,
    isArray: true,
  })
  @OneToMany(() => Position, (position) => position.functionary)
  positions: Position[]

  @ApiProperty({
    type: () => DocumentFunctionaryEntity,
    isArray: true,
  })
  @OneToMany(
    () => DocumentFunctionaryEntity,
    (documentFunctionary) => documentFunctionary.functionary,
  )
  documentFunctionaries: DocumentFunctionaryEntity[]
}
