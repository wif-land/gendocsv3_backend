import { PartialType } from '@nestjs/swagger'
import { CreateSubmodulesModuleDto } from './create-submodules-module.dto'

export class UpdateSubmodulesModuleDto extends PartialType(
  CreateSubmodulesModuleDto,
) {}
