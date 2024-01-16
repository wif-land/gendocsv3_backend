import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { YearModuleService } from './year-module.service'
import { CreateYearModuleDto } from './dto/create-year-module.dto'
import { UpdateYearModuleDto } from './dto/update-year-module.dto'

@Controller('year-module')
export class YearModuleController {
  constructor(private readonly yearModuleService: YearModuleService) {}

  @Post()
  create(@Body() createYearModuleDto: CreateYearModuleDto) {
    return this.yearModuleService.create(createYearModuleDto)
  }

  @Get()
  findAll() {
    return this.yearModuleService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.yearModuleService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateYearModuleDto: UpdateYearModuleDto,
  ) {
    return this.yearModuleService.update(+id, updateYearModuleDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.yearModuleService.remove(+id)
  }
}
