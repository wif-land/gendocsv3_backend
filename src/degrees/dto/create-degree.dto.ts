import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
  MinLength,
} from 'class-validator'

export class CreateDegreeDto {
  @IsNotEmpty()
  @MinLength(1)
  abbreviation: string

  @IsOptional()
  @MinLength(1)
  maleTitle: string

  @IsOptional()
  @MinLength(1)
  femaleTitle: string

  @IsNumberString()
  @Length(1, 1)
  degreeType: string
}
