import { PartialType } from '@nestjs/swagger'
import { CreateCertificateTypeDto } from './create-certificate-type.dto'

export class UpdateCertificateTypeDto extends PartialType(
  CreateCertificateTypeDto,
) {}
