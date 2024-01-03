import { Injectable } from '@nestjs/common'
import { CreateFunctionaryDto } from './dto/create-functionary.dto'
import { UpdateFunctionaryDto } from './dto/update-functionary.dto'

@Injectable()
export class FunctionariesService {
  create(_createFunctionaryDto: CreateFunctionaryDto) {
    return 'This action adds a new functionary'
  }

  findAll() {
    return `This action returns all functionaries`
  }

  findOne(id: number) {
    return `This action returns a #${id} functionary`
  }

  update(id: number, _updateFunctionaryDto: UpdateFunctionaryDto) {
    return `This action updates a #${id} functionary`
  }

  remove(id: number) {
    return `This action removes a #${id} functionary`
  }
}
