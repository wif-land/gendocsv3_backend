import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateFunctionaryDto {
  @ApiProperty({
    description: 'Primer nombre del funcionario',
  })
  @IsNotEmpty()
  firstName: string

  @ApiProperty({
    description: 'Segundo nombre del funcionario',
  })
  @IsNotEmpty()
  secondName: string

  @ApiProperty({
    description: 'Primer apellido del funcionario',
  })
  @IsNotEmpty()
  firstLastName: string

  @ApiProperty({
    description: 'Segundo apellido del funcionario',
  })
  @IsNotEmpty()
  secondLastName: string

  @ApiProperty({
    description: 'Correo institucional del funcionario',
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
    description: 'Correo personal del funcionario',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'personalEmail is required',
  })
  personalEmail: string

  @ApiProperty({
    description: 'Número de teléfono del funcionario',
  })
  @IsNotEmpty({
    message: 'phoneNumber is required',
  })
  phoneNumber: string

  @ApiProperty({
    description: 'Número de teléfono convencional del funcionario',
    required: false,
  })
  @IsOptional()
  regularPhoneNumber?: string

  @ApiProperty({
    description: 'Cedula de identidad del funcionario',
  })
  @IsString({
    message: 'dni is required',
  })
  dni: string

  @ApiProperty({
    description: 'Tercer nivel de educación',
  })
  @IsString({
    message: 'thirdLevelDegree is required',
  })
  thirdLevelDegree: string

  @ApiProperty({
    description: 'Cuarto nivel de educación',
  })
  @IsString({
    message: 'fourthLevelDegree is required',
  })
  fourthLevelDegree: string

  @ApiProperty({
    description: 'Estado del funcionario',
    required: false,
  })
  @IsBoolean({
    message: 'isActive is required',
  })
  @IsOptional()
  isActive?: boolean
}
