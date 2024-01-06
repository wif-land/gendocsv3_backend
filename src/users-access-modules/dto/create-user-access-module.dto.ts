import { IsArray, IsNumber, IsString } from 'class-validator'

export class CreateUserAccessModuleDto {
  @IsString()
  userId: number

  @IsArray()
  @IsNumber({}, { each: true })
  modulesIds: number[]
}
