import { PartialType } from '@nestjs/swagger'
import { CreateNumerationDocumentDto } from './create-numeration-document.dto'

export class UpdateNumerationDocumentDto extends PartialType(
  CreateNumerationDocumentDto,
) {}
