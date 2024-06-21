import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ReturnMethodDto } from '../../shared/dtos/return-method.dto'
import { IEmailObject } from '../../shared/dtos/email-msg'

@Injectable()
export class SmtpClient {
  private transporter: nodemailer.Transporter

  constructor() {
    this.initClient()
  }

  private initClient() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT || 587, // Usa el puerto adecuado para tu servidor SMTP
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
      debug: true,
      logger: false,
    })
  }

  async sendEmail(email: IEmailObject): Promise<ReturnMethodDto<string>> {
    let error = null
    const message = null

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email.to,
      subject: email.subject,
      text: email.text,
    }

    try {
      await this.transporter.sendMail({
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
      })
      return new ReturnMethodDto<string>(message, error)
    } catch (err) {
      error = err.message
      return new ReturnMethodDto<string>(null, error)
    }
  }
}
