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
import { ApiResponse } from '../shared/interfaces/response.interface'

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(ProvinceEntity)
    private readonly provinceRepository: Repository<ProvinceEntity>,
  ) {}

  async createProvince(
    createProvinceDto: CreateProvinceDto,
  ): Promise<ApiResponse<ProvinceEntity>> {
    const alreadyExist = await this.provinceRepository.findOneBy({
      name: createProvinceDto.name,
    })

    if (alreadyExist) {
      throw new ProvinceAlreadyExistsError(
        `La provincia ${createProvinceDto.name} ya existe`,
      )
    }

    const province = this.provinceRepository.create(createProvinceDto)

    const newProvince = await this.provinceRepository.save(province)

    if (!newProvince) {
      throw new ProvinceAlreadyExistsError('Error al crear la provincia') // Change this and create an error class
    }

    return {
      message: 'Provincia creada con éxito',
      data: newProvince,
    }
  }

  async createCity(
    createCityDto: CreateCityDto,
  ): Promise<ApiResponse<CityEntity>> {
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

    const newCity = await this.cityRepository.save(city)

    if (!newCity) {
      throw new CityNotFoundError('Error al crear una ciudad') // Change this and create an error class
    }

    return {
      message: 'Ciudad creada con éxito',
      data: newCity,
    }
  }

  async findAllCities(): Promise<ApiResponse<CityEntity[]>> {
    const cities = await this.cityRepository.find()

    return {
      message: 'Ciudades encontradas',
      data: cities,
    }
  }

  async findAllProvinces(): Promise<ApiResponse<ProvinceEntity[]>> {
    const provinces = await this.provinceRepository.find()

    return {
      message: 'Provincias encontradas',
      data: provinces,
    }
  }

  async findCitiesByProvince(
    provinceId: number,
  ): Promise<ApiResponse<CityEntity[]>> {
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

    return {
      message: `Ciudades encontradas para la provincia ${province.name}`,
      data: cities,
    }
  }

  async findOneCity(id: number): Promise<ApiResponse<CityEntity>> {
    const city = await this.cityRepository.findOne({ where: { id } })

    if (!city) {
      throw new CityNotFoundError(`Ciudad con id ${id} no existe`)
    }

    return {
      message: 'Ciudad encontrada',
      data: city,
    }
  }

  async updateCity(
    id: number,
    updateCityDto: UpdateCityDto,
  ): Promise<ApiResponse<CityEntity>> {
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

    const newCity = await this.cityRepository.save(city)
    if (!newCity) {
      throw new CityNotFoundError('Ciudad no encontrada')
    }

    return {
      message: 'Ciudad actualizada con éxito',
      data: newCity,
    }
  }

  async updateProvince(
    id: number,
    updateProvinceDto: CreateProvinceDto,
  ): Promise<ApiResponse<ProvinceEntity>> {
    const province = await this.provinceRepository.preload({
      ...updateProvinceDto,
      id,
    })

    if (!province) {
      throw new ProvinceNotFoundError('Provincia no encontrada')
    }

    const provinceUpdated = await this.provinceRepository.save(province)

    return {
      message: 'Provincia actualizada con éxito',
      data: provinceUpdated,
    }
  }
}
