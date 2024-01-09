import { Column, Entity } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base.entity'
import { ICouncil } from '../interfaces/council.interface'

@Entity('careers')
export class CouncilEntity extends BaseAppEntity implements ICouncil {
  @Column()
  name: string
}
