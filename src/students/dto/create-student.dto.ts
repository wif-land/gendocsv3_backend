import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsPositive,
  IsEnum,
  IsNumber,
} from 'class-validator'
import { DtoUtils } from '../../shared/utils/dtos'
import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'
import { GENDER } from '../../shared/enums/genders'

export class CreateStudentDto {
  @ApiProperty({
    description: 'Primer nombre del estudiante',
  })
  @IsString()
  firstName: string

  @ApiProperty({
    description: 'Segundo nombre del estudiante',
  })
  @IsString()
  secondName: string

  @ApiProperty({
    description: 'Primer apellido del estudiante',
  })
  @IsString()
  firstLastName: string

  @ApiProperty({
    description: 'Segundo apellido del estudiante',
  })
  @IsString()
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
  @IsString()
  outlookEmail: string

  @ApiProperty({
    description: 'Correo personal del estudiante',
  })
  @IsEmail()
  @IsString({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'personalEmail',
    }),
  })
  personalEmail: string

  @ApiProperty({
    description: 'Número de teléfono del estudiante',
  })
  @IsString({
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
    enum: GENDER,
  })
  @IsEnum(GENDER)
  gender: GENDER

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
    type: Number,
  })
  @IsNumber()
  canton: number

  @ApiProperty({
    description: 'Creditos aprobados',
  })
  @IsNumber()
  approvedCredits: number

  @ApiProperty({
    description: 'Estado del estudiante',
    required: false,
  })
  @IsBoolean({
    message: 'isActive is required',
  })
  @IsOptional()
  isActive?: boolean

  @ApiProperty({
    description: 'Título de bachiller del estudiante',
  })
  @IsString({
    message: 'bachelorDegree is required',
  })
  bachelorDegree: string

  @ApiProperty({
    description: 'Fecha de inicio de estudios del estudiante',
  })
  @IsDate({
    message: 'startStudiesDate is required',
  })
  @Type(() => Date)
  startStudiesDate: Date

  @ApiProperty({
    description: 'Fecha de fin de estudios del estudiante',
    required: false,
  })
  @IsDate({
    message: 'there is a problem with endStudiesDate',
  })
  @IsOptional()
  @Type(() => Date)
  endStudiesDate: Date

  @ApiProperty({
    description: 'Horas de vinculación',
    required: false,
  })
  @IsPositive({
    message: 'there is a problem with vinculationHours',
  })
  @IsOptional()
  vinculationHours?: number

  @ApiProperty({
    description: 'Horas de practicas',
    required: false,
  })
  @IsPositive({
    message: 'there is a problem with intershipHours',
  })
  @IsOptional()
  internshipHours?: number

  @ApiProperty({
    description: 'Id de la carrera a la que pertenece el estudiante',
  })
  @IsNumber(
    {},
    {
      message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
        '{field}': 'career',
      }),
    },
  )
  career: number
}
