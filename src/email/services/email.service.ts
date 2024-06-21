import { Injectable } from '@nestjs/common'

import { EmailObject } from '../clients/base-client.interface'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(emailObject: EmailObject) {
    return this.mailService.sendMail(emailObject)
  }
}
