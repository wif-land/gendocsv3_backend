import { Injectable } from '@nestjs/common'
import { CreateYearModuleDto } from './dto/create-year-module.dto'
import { UpdateYearModuleDto } from './dto/update-year-module.dto'

@Injectable()
export class YearModuleService {
  create(createYearModuleDto: CreateYearModuleDto) {
    return `This action adds a new yearModule ${createYearModuleDto}`
  }

  findAll() {
    return `This action returns all yearModule`
  }

  findOne(id: number) {
    return `This action returns a #${id} yearModule`
  }

  update(id: number, updateYearModuleDto: UpdateYearModuleDto) {
    return `This action updates a #${id} yearModule ${updateYearModuleDto}`
  }

  remove(id: number) {
    return `This action removes a #${id} yearModule`
  }
}
