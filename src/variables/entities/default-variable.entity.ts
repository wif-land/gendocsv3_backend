import { Column, Entity } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('default_variables')
export class DefaultVariable extends BaseApp {
  @ApiProperty({
    example: '{{ESTU_UP}}',
    description: 'Nombre de la variable',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string

  @ApiProperty({
    example: 'Nombre del estudiante en mayúscula',
    description: 'Descripción de la variable',
  })
  @Column({
    name: 'description',
    type: 'varchar',
  })
  description: string
}
