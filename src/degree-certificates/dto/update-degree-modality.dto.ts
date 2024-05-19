import { PartialType } from '@nestjs/swagger'
import { CreateDegreeModalityDto } from './create-degree-modality.dto'

export class UpdateDegreeModalityDto extends PartialType(
  CreateDegreeModalityDto,
) {}
