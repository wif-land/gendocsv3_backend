import { IsNotEmpty } from 'class-validator'

export class CreateModuleDTO {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  code: string
}
