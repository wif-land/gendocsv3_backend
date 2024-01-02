import { PartialType } from '@nestjs/swagger'
import { CreateSubmoduleDto } from './create-submodule.dto'

export class UpdateSubmoduleDto extends PartialType(CreateSubmoduleDto) {}
