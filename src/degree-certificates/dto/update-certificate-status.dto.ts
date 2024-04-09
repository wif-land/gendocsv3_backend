import { PartialType } from '@nestjs/swagger'
import { CreateCertificateStatusDto } from './create-certificate-status.dto'

export class UpdateCertificateStatusDto extends PartialType(
  CreateCertificateStatusDto,
) {}
