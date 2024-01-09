import { PartialType } from '@nestjs/swagger'
import { CreateYearModuleDto } from './create-year-module.dto'

export class UpdateYearModuleDto extends PartialType(CreateYearModuleDto) {}
