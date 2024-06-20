import { Injectable } from '@nestjs/common'
import { ReturnMethodDto } from '../../shared/dtos/return-method.dto'

export interface EmailObject {
  text: string
  to: string
  subject: string
  attachment?:
    | {
        data: string
        alternative: boolean
      }[]
    | {
        path: string
        type: string
        name: string
      }[]
}

@Injectable()
export class SmtpClient {
  private client

  constructor() {
    this.initClient()
  }

  private async initClient() {
    // eslint-disable-next-line import/no-unresolved
    const { SMTPClient } = await import('emailjs')
    this.client = new SMTPClient({
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      host: process.env.SMTP_HOST,
      tls: {
        ciphers: 'SSLv3',
      },
    })
  }

  private async emailObject({ text, subject, to, attachment }: EmailObject) {
    // eslint-disable-next-line import/no-unresolved
    const { Message } = await import('emailjs')
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
