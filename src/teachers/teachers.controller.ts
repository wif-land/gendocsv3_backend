import { Controller, Get, Param, Delete } from '@nestjs/common'
import { TeachersService } from './teachers.service'

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  findAll() {
    return this.teachersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(+id)
  }
}
