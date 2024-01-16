import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
} from 'class-validator'

export class CreateStudentDto {
  @ApiProperty({
    description: 'Primer nombre del estudiante',
  })
  @IsNotEmpty()
  firstName: string

  @ApiProperty({
    description: 'Segundo nombre del estudiante',
  })
  @IsNotEmpty()
  secondName: string

  @ApiProperty({
    description: 'Primer apellido del estudiante',
  })
  @IsNotEmpty()
  firstLastName: string

  @ApiProperty({
    description: 'Segundo apellido del estudiante',
  })
  @IsNotEmpty()
  secondLastName: string

  @ApiProperty({
    description: 'Correo institucional del estudiante',
  })
  @IsEmail(
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      host_whitelist: ['uta.edu.ec'],
    },
    {
      message: 'email must be a valid UTA email',
    },
  )
  @IsNotEmpty()
  outlookEmail: string

  @ApiProperty({
    description: 'Correo personal del estudiante',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'personalEmail is required',
  })
  personalEmail: string

  @ApiProperty({
    description: 'Número de teléfono del estudiante',
  })
  @IsNotEmpty({
    message: 'phoneNumber is required',
  })
  phoneNumber: string

  @ApiProperty({
    description: 'Número de teléfono convencional del estudiante',
    required: false,
  })
  @IsOptional()
  regularPhoneNumber?: string

  @ApiProperty({
    description: 'Cedula de identidad del estudiante',
  })
  @IsString({
    message: 'dni is required',
  })
  dni: string

  @ApiProperty({
    description: 'Matrícula',
  })
  @IsString({
    message: 'registration is required',
  })
  registration: string

  @ApiProperty({
    description: 'Folio',
  })
  @IsString({
    message: 'folio is required',
  })
  folio: string

  @ApiProperty({
    description: 'Género',
  })
  @IsString({
    message: 'gender is required',
  })
  gender: string

  @ApiProperty({
    example: '1999-12-31',
    description: 'Fecha de nacimiento',
  })
  @IsDate({
    message: 'birthdate is required',
  })
  @Type(() => Date)
  birthdate: Date

  @ApiProperty({
    description: 'Cantón de nacimiento',
  })
  @IsString({
    message: 'canton is required',
  })
  canton: string

  @ApiProperty({
    description: 'Creditos aprobados',
  })
  @IsNotEmpty({
    message: 'approvedCredits is required',
  })
  approvedCredits: number

  @ApiProperty({
    description: 'Estado del funcionario',
    required: false,
  })
  @IsBoolean({
    message: 'isActive is required',
  })
  @IsOptional()
  isActive?: boolean

  @ApiProperty({
    description: 'Id de la carrera a la que pertenece el estudiante',
  })
  @IsNotEmpty({
    message: 'careerId is required',
  })
  careerId: number
}
