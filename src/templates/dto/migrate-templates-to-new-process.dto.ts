import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class MigrateTemplatesToNewProcessDto {
  @IsArray()
  templateIds: number[]

  @IsOptional()
  @IsString()
  newProcessName?: string
  @IsNumber()
  userId: number
  @IsNumber()
  moduleId: number

  @IsOptional()
  @IsNumber()
  processId?: number
}
