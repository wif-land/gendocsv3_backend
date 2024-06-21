import { Inject, Injectable } from '@nestjs/common'

import { SmtpClient } from '../clients/smtp-client'
import { IEmailObject } from '../../shared/dtos/email-msg'
import path from 'path'
import fs from 'fs'
import Handlebars from 'handlebars'

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
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, '../templates/recover-password.hbs'),
      'utf8',
    )
    const template = Handlebars.compile(emailTemplateSource)
    const htmlToSend = template({
      resetLink: `http://${process.env.SERVER_IP}:${process.env.APP_PORT}/auth/new-password?token=${token}`,
    })

    const emailObject: IEmailObject = {
      to: email,
      subject: '[GenDocs] - Recuperación de contraseña',
      html: htmlToSend,
    }

    return this.sendEmail(emailObject)
  }

  async sendWelcomeEmail(email: string) {
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, '../templates/welcome-gendocs.hbs'),
      'utf8',
    )
    const template = Handlebars.compile(emailTemplateSource)
    const htmlToSend = template({
      message: 'Estamos emocionados que te sumen al equipo de GenDocs',
    })

    const emailObject: IEmailObject = {
      to: email,
      subject: '[GenDocs] - Bienvenido a la plataforma',
      html: htmlToSend,
    }

    return this.sendEmail(emailObject)
  }
}
