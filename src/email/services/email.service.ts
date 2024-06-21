import { Inject, Injectable } from '@nestjs/common'

import { SmtpClient } from '../clients/smtp-client'
import { IEmailObject } from '../../shared/dtos/email-msg'

@Injectable()
export class EmailService {
  constructor(
    @Inject('SmtpClient')
    private readonly stmpClient: SmtpClient,
  ) {}

  async sendEmail(emailObject: IEmailObject) {
    return this.stmpClient.sendEmail(emailObject)
  }

  async sendRecoveryPasswordEmail(email: string, token: string) {
    const emailObject: IEmailObject = {
      to: email,
      subject: 'GENDOCS - Recuperación de contraseña',
      body: `Para recuperar tu contraseña, haz click en el siguiente enlace: http://localhost:3000/auth/new-password?token=${token}
      Este enlace expirará en 1 hora.
      `,
    }

    return this.sendEmail(emailObject)
  }

  async sendWelcomeEmail(email: string) {
    const emailObject: IEmailObject = {
      to: email,
      subject: 'GENDOCS - Bienvenido a la plataforma',
      body: `¡Bienvenido a GENDOCS!`,
    }

    return this.sendEmail(emailObject)
  }
}
