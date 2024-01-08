import { Column, Entity } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('variables')
export class Variable extends BaseApp {
  @ApiProperty({
    example: '{{SALUDO}}',
    description: 'Nombre de la variable',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string

  @ApiProperty({
    example: 'Variable de saludo general',
    description: 'Descripción de la variable',
  })
  @Column({
    name: 'description',
    type: 'varchar',
  })
  description: string

  @ApiProperty({
    example: 'Hola Mundo',
    description: 'Valor de la variable',
  })
  @Column({
    name: 'value',
    type: 'varchar',
  })
  value: string
}
