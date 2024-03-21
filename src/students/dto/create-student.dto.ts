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
import { DtoUtils } from '../../shared/utils/dtos'
import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'

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
      host_whitelist: ['uta.edu.ec'],
    },
    {
      message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.email, {
        '{field}': 'outlookEmail',
      }),
    },
  )
  @IsNotEmpty()
  outlookEmail: string

  @ApiProperty({
    description: 'Correo personal del estudiante',
  })
  @IsEmail()
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'personalEmail',
    }),
  })
  personalEmail: string

  @ApiProperty({
    description: 'Número de teléfono del estudiante',
  })
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'phoneNumber',
    }),
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
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'career',
    }),
  })
  career: number
}
