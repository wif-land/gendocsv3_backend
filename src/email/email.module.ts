import { Module } from '@nestjs/common'
import { EmailService } from './services/email.service'
import { SmtpClient } from './clients/smtp-client'
import { EmailController } from './email.controller'

@Module({
  controllers: [EmailController],

  providers: [
    EmailService,
    {
      provide: 'SmtpClient',
      useClass: SmtpClient,
    },
  ],
  exports: [EmailService, SmtpClient],
})
export class EmailModule {}
