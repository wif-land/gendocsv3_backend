import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class DefaultEditionDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  positionOrder: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  positionName: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPresident: boolean

  @IsOptional()
  functionary?: number

  @IsOptional()
  student?: number
}
