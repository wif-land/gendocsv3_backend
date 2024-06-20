import { Inject, Injectable } from '@nestjs/common'

import { EmailObject, SmtpClient } from '../clients/smtp-client'

@Injectable()
export class EmailService {
  constructor(
    @Inject('SmtpClient')
    private readonly stmpClient: SmtpClient,
  ) {}

  // async sendTestEmail(
  //   recipients: string[],
  //   body = 'This is a test mail',
  // ): Promise<void> {
  //   const mail: MailDataRequired = {
  //     to: recipients,
  //     from: 'ddlm.montenegro@uta.edu.ec',
  //     subject: 'NOTIFICACIÓN',
  //     content: [{ type: 'text/plain', value: body }],
  //   }

  //   await this.sendGridClient.send(mail)
  // }

  async sendEmail(emailObject: EmailObject) {
    return this.stmpClient.sendEmail(emailObject)
  }
}
