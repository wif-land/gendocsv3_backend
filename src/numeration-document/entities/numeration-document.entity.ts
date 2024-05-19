import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'
import { NumerationState } from '../../shared/enums/numeration-state'
import { CouncilEntity } from '../../councils/entities/council.entity'
import { YearModuleEntity } from '../../year-module/entities/year-module.entity'
import { DocumentEntity } from '../../documents/entities/document.entity'

@Entity('numeration-documents')
export class NumerationDocumentEntity extends BaseAppEntity {
  @ApiProperty({
    example: '1',
    description: 'Número para usar en la numeración',
  })
  @Column({
    name: 'number',
    type: 'int',
  })
  number: number

  @ApiProperty({
    example: `${NumerationState.ENQUEUED}`,
    description: 'Identificador único del proceso',
    enum: NumerationState,
  })
  @Column({
    name: 'state',
    type: 'enum',
    enum: NumerationState,
    default: NumerationState.USED,
  })
  state: NumerationState

  @ApiProperty({
    example: '1',
    description: 'Identificador único del consejo',
  })
  @ManyToOne(() => CouncilEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'council_id' })
  council: CouncilEntity

  @ApiProperty({
    example: '1',
    description: 'Identificador único del year_module',
    type: () => YearModuleEntity,
  })
  @ManyToOne(() => YearModuleEntity, { nullable: false })
  @JoinColumn({ name: 'year_module_id' })
  yearModule: YearModuleEntity

  @OneToOne(() => DocumentEntity, (document) => document.numerationDocument, {
    eager: false,
  })
  document: DocumentEntity
}
