import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common'
import { AttendanceService } from './service'
import { ApiTags } from '@nestjs/swagger'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { CreateEditDefaultMemberDTO } from './dto/create-edit-default-member.dto'
import { Auth } from '../auth/decorators/auth-decorator'
import {
  RolesThatCanQuery,
  RolesThatCanMutate,
} from '../auth/decorators/roles-decorator'

@ApiTags('Attendance')
@Controller('attendance')
export class CouncilsAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Auth(...RolesThatCanQuery)
  @Get('default/:moduleId')
  async getDefaultAttendance(
    @Param('moduleId', ParseIntPipe) moduleId: number,
  ) {
    return new ApiResponseDto(
      'Success',
      await this.attendanceService.getDefaultByModule(moduleId),
    )
  }

  @Auth(...RolesThatCanQuery)
  @Get('council/:councilId')
  async getByCouncil(@Param('councilId', ParseIntPipe) councilId: number) {
    return new ApiResponseDto(
      'Success',
      await this.attendanceService.getByCouncil(councilId),
    )
  }

  @Auth(...RolesThatCanMutate)
  @Post('default/:moduleId')
  async createEditDefault(
    @Param('moduleId') moduleId: number,
    @Body() body: CreateEditDefaultMemberDTO[],
  ) {
    return new ApiResponseDto(
      'Representantes modificados exitosamente',
      await this.attendanceService.handleDefaultMembersManipulation(
        moduleId,
        body,
      ),
    )
  }

  @Auth(...RolesThatCanMutate)
  @Patch(':id')
  async toggleHasAssisted(@Param('id', ParseIntPipe) id: number) {
    return new ApiResponseDto(
      'Representantes modificados exitosamente',
      await this.attendanceService.toggleHasAssisted(id),
    )
  }
}
