import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('variables')
export class VariableEntity extends BaseAppEntity {
  @ApiProperty({
    example: '{{SALUDO}}',
    description: 'Variable',
  })
  @Column({
    name: 'variable',
    type: 'varchar',
    unique: true,
  })
  variable: string

  @ApiProperty({
    example: 'Variable de saludo general',
    description: 'nombre de la variable',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string

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
