import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { ProvinceEntity } from './province.entity'

@Entity('cities')
export class CityEntity extends BaseAppEntity {
  @ApiProperty({
    type: String,
    description: 'Nombre de la ciudad',
  })
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string

  @ManyToOne(() => ProvinceEntity, (province) => province.cities, {
    eager: true,
  })
  @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
  province: ProvinceEntity
}
