import { Column, Entity, JoinColumn } from 'typeorm'
import { BaseApp } from '../../shared/entities/base-app.entity'
import { ApiProperty } from '@nestjs/swagger'
import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { DocumentEntity } from './document.entity'

@Entity('document_functionaries')
export class DocumentFunctionaryEntity extends BaseApp {
  @ApiProperty({
    example: '1',
    description: 'Id del documento',
  })
  @JoinColumn({ name: 'document_id' })
  document: DocumentEntity

  @ApiProperty({
    example: '1',
    description: 'Id del funcionario',
  })
  @JoinColumn({ name: 'functionary_id' })
  functionary: FunctionaryEntity

  @ApiProperty({
    example: 'true',
    description: 'Indica si el funcionario ha sido notificado',
  })
  @Column({
    name: 'functionary_notified',
    type: 'boolean',
    default: false,
  })
  functionaryNotified: boolean
}
