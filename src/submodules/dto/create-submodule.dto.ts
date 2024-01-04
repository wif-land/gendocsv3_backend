import { IsString } from 'class-validator'

export class CreateSubmoduleDto {
  @IsString()
  name: string
}
