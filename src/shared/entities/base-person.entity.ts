import { Column } from 'typeorm'
import { BaseApp } from './base-app.entity'

export class BasePerson extends BaseApp {
  @Column({
    name: 'dni',
    type: 'varchar',
    length: 10,
    unique: true,
  })
  dni: string

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 50,
  })
  firstName: string

  @Column({
    name: 'second_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  secondName?: string

  @Column({
    name: 'first_last_name',
    type: 'varchar',
    length: 50,
  })
  firstLastName: string

  @Column({
    name: 'second_last_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  secondLastName?: string

  @Column({
    name: 'outlook_email',
    unique: true,
    type: 'varchar',
    length: 255,
  })
  outlookEmail: string

  @Column({
    name: 'google_email',
    unique: true,
    type: 'varchar',
    length: 255,
  })
  googleEmail: string

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 10,
  })
  phoneNumber: string

  @Column({
    name: 'regular_phone_number',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  regularPhoneNumber?: string
}
