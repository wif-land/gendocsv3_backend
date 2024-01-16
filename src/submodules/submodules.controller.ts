import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { SubmodulesService } from './submodules.service'
import { CreateSubmoduleDto } from './dto/create-submodule.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('submodules')
@Controller('submodules')
export class SubmodulesController {
  constructor(private readonly submodulesService: SubmodulesService) {}

  @Post()
  async create(@Body() createSubmoduleDto: CreateSubmoduleDto) {
    return await this.submodulesService.create(createSubmoduleDto)
  }

  @Get()
  findAll() {
    return this.submodulesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.submodulesService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.submodulesService.remove(id)
  }
}
