import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common'
import { FunctionariesService } from './functionaries.service'
import { CreateFunctionaryDto } from './dto/create-functionary.dto'
import { UpdateFunctionaryDto } from './dto/update-functionary.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Functionary } from './entities/functionary.entity'

@ApiTags('Functionaries')
@Controller('functionaries')
export class FunctionariesController {
  constructor(private readonly functionariesService: FunctionariesService) {}

  @Post()
  create(@Body() createFunctionaryDto: CreateFunctionaryDto) {
    return this.functionariesService.create(createFunctionaryDto)
  }

  @ApiResponse({ isArray: true, type: Functionary })
  @Get()
  async findAll() {
    return this.functionariesService.findAll()
  }

  @ApiResponse({ type: Functionary })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.functionariesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFunctionaryDto: UpdateFunctionaryDto,
  ) {
    return this.functionariesService.update(id, updateFunctionaryDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.functionariesService.remove(id)
  }
}
