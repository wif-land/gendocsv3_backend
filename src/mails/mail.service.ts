import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class MailService {
  private readonly logger: Logger = new Logger(MailService.name)

  constructor(private readonly mailerService: MailerService) {}

  async testEmail() {
    const toEmails = ['leninner@gmail.com']
    const template = './test.hbs'

    await this.mailerService.sendMail({
      to: toEmails,
      from: 'Remitente: <mazabandalenin180@gmail.com',
      subject: 'Test email',
      template,
      context: {
        user: 'Lenin',
      },
    })

    this.logger.log('Email sent')
  }
}
