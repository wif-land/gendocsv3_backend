import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateCertificateStatusDto {
  @IsString()
  @MinLength(1)
  code: string

  @IsString()
  @MinLength(1)
  maleName: string

  @IsString()
  @MinLength(1)
  femaleName: string

  @IsBoolean()
  @IsOptional()
  isActive: boolean
}
