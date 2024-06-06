import { Type } from 'class-transformer'
import {
  IsDate,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export class CreateDegreeCertificateBulkDto {
  @IsString()
  // eslint-disable-next-line no-magic-numbers
  @MinLength(5, {
    message: 'El título debe ser mayor a 5 caracteres',
  })
  topic: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  presentationDate: Date

  @IsNumberString()
  studentDni: string

  @IsString()
  certificateType: string

  @IsOptional()
  @IsString()
  certificateStatus: string

  @IsOptional()
  link: string

  @IsString()
  firstMainQualifierDni: string

  @IsString()
  secondMainQualifierDni: string

  @IsOptional()
  @IsString()
  firstSecondaryQualifierDni: string

  @IsOptional()
  @IsString()
  secondSecondaryQualifierDni: string

  @IsString()
  mentorDni: string

  @IsString()
  qualifiersResolution: string

  @IsNumberString({ no_symbols: false })
  curriculumGrade: string

  @IsOptional()
  @IsString()
  gradesDetails: string

  @IsInt()
  userId: number
}
