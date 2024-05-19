import { Controller, Post, Body } from '@nestjs/common'
import { YearModuleService } from './year-module.service'
import { CreateYearModuleDto } from './dto/create-year-module.dto'

@Controller('year-module')
export class YearModuleController {
  constructor(private readonly yearModuleService: YearModuleService) {}

  @Post()
  create(@Body() createYearModuleDto: CreateYearModuleDto) {
    return this.yearModuleService.create(createYearModuleDto)
  }
}
