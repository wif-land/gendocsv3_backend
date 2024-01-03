import { PartialType } from '@nestjs/swagger'
import { CreateUserAccessModuleDto } from './create-user-access-module.dto'

export class UpdateUserAccessModuleDto extends PartialType(
  CreateUserAccessModuleDto,
) {}
