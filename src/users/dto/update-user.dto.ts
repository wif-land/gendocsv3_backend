import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator'
import { RolesType } from '../../auth/decorators/roles.decorator'

const MIN_PASSWORD_LENGTH = 4

export class UpdateUserDTO {
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

  @IsOptional()
  @IsBoolean({
    message: 'isActive param must be a boolean',
  })
  isActive?: boolean

  @IsArray({
    message: 'accessModules must be an array',
  })
  @IsOptional()
  accessModules?: number[]
}
