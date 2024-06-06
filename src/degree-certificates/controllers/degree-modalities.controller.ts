import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { DegreeModalitiesService } from '../services/degree-modalities.service'
import { CreateDegreeModalityDto } from '../dto/create-degree-modality.dto'
import { UpdateDegreeModalityDto } from '../dto/update-degree-modality.dto'

@Controller('degree-certificates/degre-modalities')
export class DegreeModalitiesController {
  constructor(
    private readonly degreeModalitiesService: DegreeModalitiesService,
  ) {}

  @Get()
  async getDegreeModalities() {
    return await this.degreeModalitiesService.findAllDegreeModalities()
  }

  @Post()
  async createDegreeModality(@Body() dto: CreateDegreeModalityDto) {
    return await this.degreeModalitiesService.createDegreeModality(dto)
  }

  @Patch('/:id') async updateDegreeModality(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDegreeModalityDto,
  ) {
    return await this.degreeModalitiesService.updateDegreeModality(id, dto)
  }

  @Delete('/:id') async deleteDegreeModality(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.degreeModalitiesService.deleteDegreeModality(id)
  }
}
