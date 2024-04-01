import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { StudentsService } from './students.service'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Student } from './entities/student.entity'
import { CreateStudentsBulkDto } from './dto/create-students-bulk.dto'
import { PaginationDto } from '../shared/dtos/pagination.dto'

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentsService.create(createStudentDto)
  }

  @Post('bulk')
  async createBulk(@Body() createStudentsBulkDto: CreateStudentsBulkDto) {
    return await this.studentsService.createBulk(createStudentsBulkDto)
  }

  @ApiResponse({ isArray: true, type: Student })
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.studentsService.findAll(paginationDto)
  }

  @ApiResponse({ type: Student })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.studentsService.findOne(id)
  }

  @Get('search/:field')
  async findByField(
    @Param('field') field: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.studentsService.findByField(field, paginationDto)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentsService.update(id, updateStudentDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.studentsService.remove(id)
  }
}
