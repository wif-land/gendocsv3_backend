import { Body, Controller, Post } from '@nestjs/common'
import { EmailService } from './services/email.service'
import { EmailObject } from './clients/base-client.interface'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() emailObject: EmailObject) {
    return this.emailService.sendEmail(emailObject)
  }
}
