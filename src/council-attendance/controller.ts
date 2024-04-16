import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { AttendanceService } from './service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Attendance')
@Controller('attendance')
export class CouncilsAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Get('default/:moduleId')
  async getDefaultAttendance(
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    return {
      message: 'Success',
      data: await this.attendanceService.getDefaultByModule(moduleId),
    }
  }

  @Get('council/:councilId')
  async getByCouncil(
    @Param('councilId', ParseIntPipe) councilId: number,
  ) {
    return {
      message: 'Success',
      data: await this.attendanceService.getByCouncil(councilId),
    }
  }

  @Post()
  async create(@Body() body: any) {
    return {
      message: 'Creado exitosamente',
      data: await this.attendanceService.create(body),
    }
  }
}
