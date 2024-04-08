import { Column, Entity, OneToMany } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'
import { CityEntity } from './city.entity'

@Entity('provinces')
export class ProvinceEntity extends BaseApp {
  @ApiProperty({
    type: String,
    description: 'Nombre de la provincia',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string

  @OneToMany(() => CityEntity, (city) => city.province)
  cities: CityEntity[]
}
