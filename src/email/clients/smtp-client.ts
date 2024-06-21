import { Injectable } from '@nestjs/common'
import { ReturnMethodDto } from '../../shared/dtos/return-method.dto'
// eslint-disable-next-line import/no-unresolved
import { SMTPClient, Message } from 'emailjs'
import { BaseEmailClient, EmailObject } from './base-client.interface'

@Injectable()
export class SmtpClient extends BaseEmailClient {
  private client

  constructor() {
    super()
    this.initClient()
  }

  async initClient() {
    this.client = new SMTPClient({
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      host: process.env.SMTP_HOST,
      tls: {
        ciphers: 'SSLv3',
      },
    })
  }

  async emailObject({ text, subject, to, attachment }: EmailObject) {
    return new Message({
      text,
      from: process.env.SMTP_FROM,
      to,
      subject,
      attachment,
    })
  }

  async sendEmail(email: EmailObject): Promise<ReturnMethodDto<string>> {
    const emailMessage = await this.emailObject(email)

    let error = null
    let message = null

    try {
      await new Promise((resolve, reject) => {
        this.client.send(emailMessage, (err, mess) => {
          if (err) {
            reject(err)
          } else {
            resolve(mess)
          }
        })
      })
        .then((mess) => {
          message = mess
        })
        .catch((err) => {
          error = err
        })

      return new ReturnMethodDto<string>(message, error)
    } catch (error) {
      return new ReturnMethodDto<string>(null, error)
    }
  }
}
