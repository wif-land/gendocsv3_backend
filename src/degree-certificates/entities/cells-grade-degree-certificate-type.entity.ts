import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { CertificateTypeEntity } from './certificate-type.entity'
import { BaseAppEntity } from '../../shared/entities/base-app.entity'

@Entity('cells_grade_degree_certificate_type')
export class CellsGradeDegreeCertificateTypeEntity extends BaseAppEntity {
  @Column({
    name: 'cell',
    type: 'varchar',
  })
  cell: string

  @Column({
    name: 'grade_variable',
    type: 'varchar',
  })
  gradeVariable: string

  @Column({
    name: 'grade_text_variable',
    type: 'varchar',
  })
  gradeTextVariable: string

  @ManyToOne(() => CertificateTypeEntity, { eager: true })
  @JoinColumn({ name: 'certificate_type_id' })
  certificateType: CertificateTypeEntity
}
