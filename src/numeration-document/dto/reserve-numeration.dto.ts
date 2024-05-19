import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator'

export class ReserveNumerationDocumentDto {
  @IsNumber()
  @Min(1)
  start: number

  @IsNumber()
  @Min(1)
  end: number

  @IsNumber()
  councilId: number

  @IsOptional()
  @IsBoolean()
  isExtension?: boolean
}
