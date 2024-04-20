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
  @MinLength(5)
  topic: string

  @IsDate()
  @Type(() => Date)
  presentationDate: Date

  @IsInt()
  studentId: number

  @IsInt()
  careerId: number

  @IsInt()
  certificateTypeId: number

  @IsInt()
  certificateStatusId: number

  @IsInt()
  degreeModalityId: number

  @IsInt()
  roomId: number

  @IsInt()
  duration: number

  @IsString()
  // eslint-disable-next-line no-magic-numbers
  @MinLength(5)
  link: string

  @IsInt()
  submoduleYearModuleId: number

  @IsString()
  // eslint-disable-next-line no-magic-numbers
  @MinLength(5)
  gradesSheetDriveId: string

  @IsString()
  // eslint-disable-next-line no-magic-numbers
  @MinLength(5)
  documentDriveId: string

  @IsBoolean()
  @IsOptional()
  isClosed: boolean
}
