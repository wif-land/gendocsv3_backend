import { Injectable } from '@nestjs/common'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { CityEntity } from './entities/city.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ProvinceEntity } from './entities/province.entity'
import { CreateProvinceDto } from './dto/create-province.dto'
import { ProvinceAlreadyExistsError } from './errors/province-already-exists'
import { CityAlreadyExistsError } from './errors/city-already-exists'
import { CityNotFoundError } from './errors/city-not-found'
import { ProvinceNotFoundError } from './errors/province-not-found'

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(ProvinceEntity)
    private readonly provinceRepository: Repository<ProvinceEntity>,
  ) {}

  async createProvince(createProvinceDto: CreateProvinceDto) {
    const alreadyExist = await this.provinceRepository.findOneBy({
      name: createProvinceDto.name,
    })

    if (alreadyExist) {
      throw new ProvinceAlreadyExistsError(
        `La provincia ${createProvinceDto.name} ya existe`,
      )
    }

    const province = this.provinceRepository.create(createProvinceDto)

    return await this.provinceRepository.save(province)
  }

  async createCity(createCityDto: CreateCityDto) {
    const province = await this.provinceRepository.findOne({
      where: { id: createCityDto.provinceId },
    })

    if (!province) {
      throw new ProvinceNotFoundError(
        `Provincia con id ${createCityDto.provinceId} no existe`,
      )
    }

    const alreadyExists = await this.cityRepository.findOneBy({
      name: createCityDto.name,
      province: { id: createCityDto.provinceId },
    })

    if (alreadyExists) {
      throw new CityAlreadyExistsError(
        `La ciudad ${createCityDto.name} ya existe en la provincia ${province.name}`,
      )
    }

    const city = this.cityRepository.create({
      ...createCityDto,
      province: { id: createCityDto.provinceId },
    })

    return await this.cityRepository.save(city)
  }

  async findAllCities() {
    return await this.cityRepository.find()
  }

  async findAllProvinces() {
    return await this.provinceRepository.find()
  }

  async findCitiesByProvince(provinceId: number) {
    const province = await this.provinceRepository.findOne({
      where: { id: provinceId },
    })

    if (!province) {
      throw new ProvinceNotFoundError(
        `Provincia con id ${provinceId} no existe`,
      )
    }

    const cities = await this.cityRepository.find({
      where: { province: { id: provinceId } },
    })

    if (!cities) {
      throw new CityNotFoundError(
        `No existen ciudades para la provincia ${province.name}`,
      )
    }

    return cities
  }

  async findOneCity(id: number) {
    const city = await this.cityRepository.findOne({ where: { id } })

    if (!city) {
      throw new CityNotFoundError(`Ciudad con id ${id} no existe`)
    }

    return city
  }

  async updateCity(id: number, updateCityDto: UpdateCityDto) {
    const province = await this.provinceRepository.findOne({
      where: { id: updateCityDto.provinceId },
    })

    if (!province) {
      throw new ProvinceNotFoundError(
        `Provincia con id ${updateCityDto.provinceId} no existe`,
      )
    }

    const city = await this.cityRepository.preload({
      ...updateCityDto,
      id,
      province: { id: updateCityDto.provinceId },
    })

    if (!city) {
      throw new CityNotFoundError('Ciudad no encontrada')
    }

    return await this.cityRepository.save(city)
  }

  async updateProvince(id: number, updateProvinceDto: CreateProvinceDto) {
    const province = await this.provinceRepository.preload({
      ...updateProvinceDto,
      id,
    })

    if (!province) {
      throw new ProvinceNotFoundError('Provincia no encontrada')
    }

    return await this.provinceRepository.save(province)
  }
}
