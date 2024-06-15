import { Injectable } from '@nestjs/common'

import { MailDataRequired } from '@sendgrid/mail'
import { SendGridClient } from './sendgrid-client'

@Injectable()
export class EmailService {
  constructor(private readonly sendGridClient: SendGridClient) {}

  async sendTestEmail(
    recipients: string[],
    body = 'This is a test mail',
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipients,
      from: 'ddlm.montenegro@uta.edu.ec',
      subject: 'NOTIFICACIÓN',
      content: [{ type: 'text/plain', value: body }],
    }

    await this.sendGridClient.send(mail)
  }
}
