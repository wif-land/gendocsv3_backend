import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'
import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'

@Entity('positions')
export class Position extends BaseApp {
  @ApiProperty({
    example: "'$'{name}",
    description: 'Codigo del cargo',
    uniqueItems: true,
  })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string

  @ApiProperty({
    example: 'Cargo de prueba',
    description: 'Descripción del cargo',
  })
  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
  })
  description: string

  @ApiProperty({
    type: () => FunctionaryEntity,
  })
  @ManyToOne(() => FunctionaryEntity, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({
    name: 'functionary_id',
    referencedColumnName: 'id',
  })
  functionary: FunctionaryEntity
}
