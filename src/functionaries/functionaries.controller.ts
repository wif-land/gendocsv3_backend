import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common'
import { FunctionariesService } from './functionaries.service'
import { CreateFunctionaryDto } from './dto/create-functionary.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { FunctionaryEntity } from './entities/functionary.entity'

@ApiTags('Functionaries')
@Controller('functionaries')
export class FunctionariesController {
  constructor(private readonly functionariesService: FunctionariesService) {}

  @Post()
  async create(@Body() createFunctionaryDto: CreateFunctionaryDto) {
    return await this.functionariesService.create(createFunctionaryDto)
  }

  @ApiResponse({ isArray: true, type: FunctionaryEntity })
  @Get()
  async findAll() {
    return await this.functionariesService.findAll()
  }

  @ApiResponse({ type: FunctionaryEntity })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.functionariesService.findOne(id)
  }

  @Put()
  async update(
    @Query('id') id: number,
    @Body() updateFunctionaryDto: Partial<CreateFunctionaryDto>,
  ) {
    return await this.functionariesService.update(id, updateFunctionaryDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.functionariesService.remove(id)
  }
}
