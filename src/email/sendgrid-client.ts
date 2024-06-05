import { Injectable, Logger } from '@nestjs/common'
import { MailDataRequired, default as SendGrid } from '@sendgrid/mail'

@Injectable()
export class SendGridClient {
  private logger: Logger

  constructor() {
    console.log(process.env.SENDGRID_API_KEY)
    this.logger = new Logger(SendGridClient.name)
    SendGrid.setApiKey(
      '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',
    )
  }

  async send(mail: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(mail)
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`)
    } catch (error) {
      // You can do more with the error
      this.logger.error('Error while sending email', error)
      throw error
    }
  }
}
