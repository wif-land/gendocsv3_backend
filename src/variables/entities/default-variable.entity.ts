import { Column, Entity } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('default_variables')
export class DefaultVariable extends BaseApp {
  @ApiProperty({
    example: `{{ESTU_UP}}`,
    description: 'Variable',
  })
  @Column({
    name: 'variable',
    type: 'varchar',
  })
  variable: string

  @ApiProperty({
    example: 'Nombre del estudiante en mayúscula',
    description: 'Nombre de la variable',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string
}
