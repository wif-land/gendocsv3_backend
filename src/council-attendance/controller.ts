import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common'
import { AttendanceService } from './service'
import { ApiTags } from '@nestjs/swagger'
import { DefaultCreationDTO } from './dto/default-creation.dto'
import { DefaultEditionDTO } from './dto/default-edition.dto'

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
  async getByCouncil(@Param('councilId', ParseIntPipe) councilId: number) {
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

  @Post('default')
  async createDefault(@Body() body: DefaultCreationDTO[]) {
    return {
      message: 'Representantes por defecto creados exitosamente',
      data: await this.attendanceService.createDefault(body),
    }
  }

  @Put('default')
  async updateDefault(@Body() body: DefaultEditionDTO[]) {
    return {
      message: 'Representantes por defecto actualizados exitosamente',
      data: await this.attendanceService.updateDefault(body),
    }
  }
}
