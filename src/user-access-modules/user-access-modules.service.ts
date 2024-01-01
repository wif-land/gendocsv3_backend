import { Injectable } from '@nestjs/common'

@Injectable()
export class UserAccessModulesService {
  findAll() {
    return `This action returns all userAccessModules`
  }

  findOne(id: number) {
    return `This action returns a #${id} userAccessModule`
  }

  remove(id: number) {
    return `This action removes a #${id} userAccessModule`
  }
}
