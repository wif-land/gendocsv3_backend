import { IsEmail, IsNotEmpty } from 'class-validator'

export class NotifyMembersDTO {
  @IsNotEmpty()
  id: number

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  positionName: string
}
