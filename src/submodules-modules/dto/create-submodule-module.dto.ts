import { IsArray, IsNumber } from 'class-validator'

export class CreateSubmodulesModuleDto {
  @IsNumber()
  moduleId: number

  @IsArray()
  @IsNumber({}, { each: true })
  submoduleIds: number[]
}
