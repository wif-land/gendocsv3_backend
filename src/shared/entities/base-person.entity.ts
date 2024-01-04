import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

export class BasePerson extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @ApiProperty({
    example: 'Juan',
    description: 'Primer nombre',
  })
  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 50,
  })
  firstName: string

  @ApiProperty({
    example: 'Fernando',
    description: 'Segundo nombre',
  })
  @Column({
    name: 'second_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  secondName?: string

  @ApiProperty({
    example: 'Velasquez',
    description: 'Primer apellido',
  })
  @Column({
    name: 'first_last_name',
    type: 'varchar',
    length: 50,
  })
  firstLastName: string

  @ApiProperty({
    example: 'Ibarra',
    description: 'Segundo apellido',
  })
  @Column({
    name: 'second_last_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  secondLastName?: string

  @ApiProperty({
    example: 'fvelasquez7643@uta.edu.ec',
    description: 'Correo institucional',
  })
  @Column({
    name: 'outlook_email',
    unique: true,
    type: 'varchar',
    length: 255,
  })
  outlookEmail: string

  @ApiProperty({
    example: 'fvelasquez@gmail.com',
    description: 'Correo personal',
  })
  @Column({
    name: 'google_email',
    unique: true,
    type: 'varchar',
    length: 255,
  })
  googleEmail: string

  @ApiProperty({
    example: '0965123182',
    description: 'Teléfono celular',
  })
  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 10,
  })
  phoneNumber: string

  @ApiProperty({
    example: '231821',
    description: 'Teléfono convencional',
    required: false,
  })
  @Column({
    name: 'regular_phone_number',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  regularPhoneNumber?: string
}
