import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export class CreateDegreeCertificateDto {
  @IsString()
  // eslint-disable-next-line no-magic-numbers
  @MinLength(5, {
    message: 'El título debe ser mayor a 5 caracteres',
  })
  topic: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  presentationDate?: Date

  @IsInt()
  studentId: number

  @IsInt()
  certificateTypeId: number

  @IsInt()
  certificateStatusId: number

  @IsInt()
  degreeModalityId: number

  @IsOptional()
  @IsInt()
  roomId?: number

  @IsOptional()
  @IsInt()
  duration?: number

  @IsOptional()
  link?: string

  @IsBoolean()
  @IsOptional()
  isClosed?: boolean

  @IsInt()
  userId: number

  @IsOptional()
  @IsString()
  changeUniversityResolution?: string

  @IsOptional()
  @IsString()
  changeUniversityName?: string

  @IsOptional()
  @IsString()
  changeUniversityDate?: string
}
