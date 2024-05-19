import { Module } from '@nestjs/common'
import { CitiesService } from './cities.service'
import { CitiesController } from './cities.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CityEntity } from './entities/city.entity'
import { ProvinceEntity } from './entities/province.entity'

@Module({
  controllers: [CitiesController],
  imports: [TypeOrmModule.forFeature([CityEntity, ProvinceEntity])],
  providers: [CitiesService],
})
export class CitiesModule {}
