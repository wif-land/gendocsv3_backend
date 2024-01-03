import { PartialType } from '@nestjs/swagger'
import { CreateSubmodulesModuleDto } from './create-submodule-module.dto'

export class UpdateSubmodulesModuleDto extends PartialType(
  CreateSubmodulesModuleDto,
) {}
