import { IsArray, IsNumber } from 'class-validator'

export class CreateUserAccessModuleDto {
  @IsNumber()
  userId: string

  @IsArray()
  @IsNumber({}, { each: true })
  modulesIds: number[]
}
