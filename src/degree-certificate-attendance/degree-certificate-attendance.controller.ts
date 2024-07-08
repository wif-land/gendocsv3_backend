import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { DegreeAttendanceService } from './degree-certificate-attendance.service'
import { CreateDegreeCertificateAttendanceDto } from './dto/create-degree-certificate-attendance.dto'
import { UpdateDegreeCertificateAttendanceDto } from './dto/update-degree-certificate-attendance.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { Auth } from '../auth/decorators/auth.decorator'
import {
  RolesThatCanQuery,
  RolesThatCanMutate,
} from '../auth/decorators/roles.decorator'

@Controller('degree-certificate-attendance')
export class DegreeAttendanceController {
  constructor(
    private readonly degreeAttendanceService: DegreeAttendanceService,
  ) {}

  @Auth(...RolesThatCanMutate)
  @Post()
  create(
    @Body()
    data: CreateDegreeCertificateAttendanceDto,
  ) {
    return this.degreeAttendanceService.create(data)
  }

  @Auth(...RolesThatCanMutate)
  @Post('bulk')
  createBulk(
    @Body()
    data: CreateDegreeCertificateAttendanceDto[],
  ) {
    return this.degreeAttendanceService.createBulk(data)
  }

  @Auth(...RolesThatCanQuery)
  @Get(':degreeCertificateId')
  findByDegreeCertificateId(@Param('degreeCertificateId') id: string) {
    return this.degreeAttendanceService.findByDegreeCertificate(+id)
  }

  @Auth(...RolesThatCanMutate)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    data: UpdateDegreeCertificateAttendanceDto,
  ) {
    return this.degreeAttendanceService.update(+id, data)
  }

  @Auth(...RolesThatCanMutate)
  @Patch('bulk')
  updateBulk(
    @Body()
    data: UpdateDegreeCertificateAttendanceDto[],
  ) {
    return this.degreeAttendanceService.updateBulk(data)
  }

  @Auth(...RolesThatCanMutate)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.degreeAttendanceService.remove(+id)

    return new ApiResponseDto(
      'Asistencia al acta de grado eliminada con éxito',
      null,
    )
  }
}
