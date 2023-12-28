import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator'

export class CreateUserDTO {
  @IsNotEmpty()
  dni: string

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
  @IsPhoneNumber('EC', {
    message: 'phone must be a valid Ecuadorian phone number',
  })
  phone: string

  @IsNotEmpty()
  password: string
}
