import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateDegreeModalityDto {
  @IsString()
  @MinLength(1)
  code: string

  @IsString()
  @MinLength(1)
  name: string

  @IsBoolean()
  @IsOptional()
  isActive: boolean
}
