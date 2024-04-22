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
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { CreateEditDefaultMemberDTO } from './dto/create-edit-default-member.dto'

@ApiTags('Attendance')
@Controller('attendance')
export class CouncilsAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('default/:moduleId')
  async getDefaultAttendance(
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    return new ApiResponseDto(
      'Success',
      await this.attendanceService.getDefaultByModule(moduleId),
    )
  }

  @Get('council/:councilId')
  async getByCouncil(@Param('councilId', ParseIntPipe) councilId: number) {
    return new ApiResponseDto(
      'Success',
      await this.attendanceService.getByCouncil(councilId),
    )
  }

  @Post()
  async create(@Body() body: any) {
    return new ApiResponseDto(
      'Creado exitosamente',
      await this.attendanceService.create(body),
    )
  }

  @Post('default/:moduleId')
  async createEditDefault(
    @Param('moduleId') moduleId: number,
    @Body() body: CreateEditDefaultMemberDTO[],
  ) {
    return new ApiResponseDto(
      'Representantes modificados exitosamente',
      await this.attendanceService.createEditDefault(moduleId, body),
    )
  }
}
