import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator'
import { COUNCIL_TYPES, ICouncil } from '../interfaces/council.interface'
import { ApiProperty } from '@nestjs/swagger'
import { CreateAttendanceDto } from './create-attendance.dto'
import { DtoUtils } from '../../shared/utils/dtos'
import { VALIDATION_ERROR_MESSAGES } from '../../shared/constants'

export class CreateCouncilDto implements ICouncil {
  @ApiProperty({
    enum: COUNCIL_TYPES,
    enumName: 'CouncilType',
    description: 'Council type',
  })
  @IsNotEmpty({ message: 'Council type is required' })
  @IsEnum(COUNCIL_TYPES, {
    message: 'Council type must be EXTRAORDINARY or ORDINARY',
  })
  type: COUNCIL_TYPES

  @ApiProperty({
    description: 'Council date',
    example: '2021-10-10',
  })
  @IsNotEmpty({ message: 'Council date is required' })
  @IsISO8601({ strict: true }, { message: 'Council date must be a date' })
  date: Date

  @ApiProperty({
    description: 'Council name',
    example: 'Consejo 123',
  })
  @IsNotEmpty({ message: 'Council name is required' })
  name: string

  @ApiProperty({
    description: 'Module id asociado al consejo',
    example: '2',
  })
  @IsNotEmpty({ message: 'moduleId field is required' })
  moduleId: number

  @ApiProperty({
    description:
      'User id asociado al consejo, el usuario debe ser un funcionario',
    example: '2',
  })
  @IsNotEmpty({ message: 'userId field is required' })
  userId: number

  @ApiProperty({
    description: 'Arreglo de miembros del consejo',
  })
  @IsArray({
    message: 'Members must be a valid array of objects',
  })
  @IsNotEmpty({
    message: DtoUtils.messageError(VALIDATION_ERROR_MESSAGES.required, {
      '{field}': 'members',
    })
  })
  members: CreateAttendanceDto[]

  @ApiProperty({
    description: 'Estado del consejo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({
    description: 'Estado del consejo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean
}
