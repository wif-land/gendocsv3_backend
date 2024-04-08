import { Module } from '@nestjs/common';
import { DegreeCertificatesService } from './degree-certificates.service';
import { DegreeCertificatesController } from './degree-certificates.controller';

@Module({
  controllers: [DegreeCertificatesController],
  providers: [DegreeCertificatesService],
})
export class DegreeCertificatesModule {}
