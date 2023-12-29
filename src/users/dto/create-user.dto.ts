import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator'
import { RolesType } from '../../auth/roles-decorator'

const MIN_PASSWORD_LENGTH = 4

export class CreateUserDTO {
  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  secondName: string

  @IsNotEmpty()
  firstLastName: string

  @IsNotEmpty()
  secondLastName: string

  @IsEmail(
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      host_whitelist: ['uta.edu.ec'],
    },
    {
      message: 'email must be a valid UTA email',
    },
  )
  @IsNotEmpty()
  outlookEmail: string

  @IsEmail(
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      host_blacklist: ['gmail.com'],
    },
    {
      message: 'email must be a valid Gmail email',
    },
  )
  @IsNotEmpty({
    message: 'googleEmail is required',
  })
  googleEmail: string

  @IsNotEmpty({
    message: 'password is required',
  })
  @MinLength(MIN_PASSWORD_LENGTH, {
    message: 'password must be at least 4 characters',
  })
  password: string

  @IsNotEmpty({
    message: 'roles is required',
  })
  @IsArray({
    message: 'roles must be an array',
  })
  roles: RolesType[]

  @IsOptional()
  @IsArray({
    message: 'platformPermission must be an array',
  })
  platformPermission?: string[]
}
