import { PartialType } from '@nestjs/swagger'
import { CreateDegreeCertificateDto } from './create-degree-certificate.dto'

export class UpdateDegreeCertificateDto extends PartialType(
  CreateDegreeCertificateDto,
) {}
