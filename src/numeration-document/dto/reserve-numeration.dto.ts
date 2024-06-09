import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator'

export class ReserveNumerationDocumentDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  start: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  end: number

  @IsNumber()
  councilId: number

  @IsOptional()
  @IsBoolean()
  isExtension?: boolean
}
