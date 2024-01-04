import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BasePerson } from '../../shared/entities/base-person.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Career } from '../../careers/entites/careers.entity'

@Entity('students')
export class Student extends BasePerson {
  @ApiProperty({
    example: '070747643',
    description: 'Cédula de identidad',
    uniqueItems: true,
  })
  @Column({
    name: 'dni',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  dni: string

  @ApiProperty({
    example: '2019-2020',
    description: 'Matrícula',
  })
  @Column({
    name: 'registration',
    type: 'varchar',
  })
  registration: string

  @ApiProperty({
    example: '2020-2021',
    description: 'Folio',
  })
  @Column({
    name: 'folio',
    type: 'varchar',
  })
  folio: string

  @ApiProperty({
    example: 'Masculino',
    description: 'Género',
  })
  @Column({
    name: 'gender',
    type: 'varchar',
  })
  gender: string

  @ApiProperty({
    example: '1997-07-07',
    description: 'Fecha de nacimiento',
  })
  @Column({
    name: 'birthdate',
    type: 'date',
  })
  birthdate: Date

  @ApiProperty({
    example: 'Machala',
    description: 'Cantón de nacimiento',
  })
  @Column({
    name: 'canton',
    type: 'varchar',
  })
  canton: string

  @ApiProperty({
    example: '78',
    description: 'Créditos aprobados',
  })
  @Column({
    name: 'approved_credits',
    type: 'smallint',
  })
  approvedCredits: number

  @ApiProperty({
    type: () => Career,
  })
  @ManyToOne(() => Career, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({
    name: 'career_id',
    referencedColumnName: 'id',
  })
  career: Career

  @ApiProperty({
    example: true,
    description: 'Estado del funcionario',
    default: true,
  })
  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean
}
