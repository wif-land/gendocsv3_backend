import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { RolesType } from '../../auth/decorators/roles-decorator'
import { Module } from '../../modules/entities/modules.entity'
import { BaseAppEntity } from '../../shared/entities/base.entity'
import { Process } from '../../processes/entities/process.entity'
import { TemplateProcess } from '../../templates/entities/template-processes.entity'

@Entity('users')
export class User extends BaseAppEntity {
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
    name: 'password',
    type: 'varchar',
    length: 255,
  })
  password: string

  @Column({
    name: 'roles',
    type: 'simple-array',
  })
  roles: RolesType[]

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean

  @ManyToMany(() => Module, {
    eager: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'users_access_modules',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'module_id', referencedColumnName: 'id' },
  })
  accessModules?: Module[]

  @OneToMany(() => Process, (process) => process.user)
  processes: Process[]

  @OneToMany(() => TemplateProcess, (templateProcess) => templateProcess.user)
  templateProcesses: TemplateProcess[]
}
