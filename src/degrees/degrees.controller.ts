import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Patch,
  ParseIntPipe,
} from '@nestjs/common'
import { DegreesService } from './degrees.service'
import { CreateDegreeDto } from './dto/create-degree.dto'
import { UpdateDegreeDto } from './dto/update-degree.dto'

@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Post()
  async create(@Body() createDegreeDto: CreateDegreeDto) {
    return await this.degreesService.create(createDegreeDto)
  }

  @Get()
  async findAll() {
    return await this.degreesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.degreesService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDegreeDto: UpdateDegreeDto,
  ) {
    return await this.degreesService.update(id, updateDegreeDto)
  }
}
