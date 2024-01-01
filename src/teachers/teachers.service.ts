import { Injectable } from '@nestjs/common'

@Injectable()
export class TeachersService {
  findAll() {
    return `This action returns all teachers`
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`
  }
}
