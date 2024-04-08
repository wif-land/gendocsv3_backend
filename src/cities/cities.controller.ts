import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { CitiesService } from './cities.service'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { CreateProvinceDto } from './dto/create-province.dto'

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.createCity(createCityDto)
  }

  @Post('provinces')
  createProvince(@Body() createProvinceDto: CreateProvinceDto) {
    return this.citiesService.createProvince(createProvinceDto)
  }

  @Get()
  findAllCities() {
    return this.citiesService.findAllCities()
  }

  @Get('provinces')
  findAllProvinces() {
    return this.citiesService.findAllProvinces()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findOneCity(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.citiesService.updateCity(id, updateCityDto)
  }

  @Patch('provinces/:id')
  updateProvince(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProvinceDto: CreateProvinceDto,
  ) {
    return this.citiesService.updateProvince(id, updateProvinceDto)
  }
}
