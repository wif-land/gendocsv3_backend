import { Body, Controller, Post } from '@nestjs/common'
import { EmailService } from './services/email.service'
import { IEmailObject } from '../shared/dtos/email-msg'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() emailObject: IEmailObject) {
    return this.emailService.sendEmail(emailObject)
  }
}
