import { IsArray, IsNumber } from 'class-validator'

export class CreateUserAccessModuleDto {
  @IsNumber()
  userId: number

  @IsArray()
  @IsNumber({}, { each: true })
  modulesIds: number[]
}
