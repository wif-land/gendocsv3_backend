import { IsArray, IsNumber, IsString } from 'class-validator'

export class CreateUserAccessModuleDto {
  @IsString()
  userId: string

  @IsArray()
  @IsNumber({}, { each: true })
  modulesIds: number[]
}
