import { PartialType } from '@nestjs/swagger'
import { CreateCellGradeDegreeCertificateTypeDto } from './create-cells-grade-degree-certificate-type.dto'

export class UpdateCellGradeDegreeCertificateTypeDto extends PartialType(
  CreateCellGradeDegreeCertificateTypeDto,
) {}
