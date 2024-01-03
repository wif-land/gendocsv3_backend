import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { FunctionariesService } from './functionaries.service'
import { CreateFunctionaryDto } from './dto/create-functionary.dto'
import { UpdateFunctionaryDto } from './dto/update-functionary.dto'

@Controller('functionaries')
export class FunctionariesController {
  constructor(private readonly functionariesService: FunctionariesService) {}

  @Post()
  create(@Body() createFunctionaryDto: CreateFunctionaryDto) {
    return this.functionariesService.create(createFunctionaryDto)
  }

  @Get()
  findAll() {
    return this.functionariesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.functionariesService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFunctionaryDto: UpdateFunctionaryDto,
  ) {
    return this.functionariesService.update(+id, updateFunctionaryDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.functionariesService.remove(+id)
  }
}
