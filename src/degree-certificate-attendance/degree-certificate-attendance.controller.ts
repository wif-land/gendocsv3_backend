import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { DegreeCertificateAttendanceService } from './degree-certificate-attendance.service'
import { CreateDegreeCertificateAttendanceDto } from './dto/create-degree-certificate-attendance.dto'
import { UpdateDegreeCertificateAttendanceDto } from './dto/update-degree-certificate-attendance.dto'

@Controller('degree-certificate-attendance')
export class DegreeCertificateAttendanceController {
  constructor(
    private readonly degreeCertificateAttendanceService: DegreeCertificateAttendanceService,
  ) {}

  @Post()
  create(
    @Body()
    createDegreeCertificateAttendanceDto: CreateDegreeCertificateAttendanceDto,
  ) {
    return this.degreeCertificateAttendanceService.create(
      createDegreeCertificateAttendanceDto,
    )
  }

  @Post('bulk')
  createBulk(
    @Body()
    createDegreeCertificateAttendanceDto: CreateDegreeCertificateAttendanceDto[],
  ) {
    return this.degreeCertificateAttendanceService.createBulk(
      createDegreeCertificateAttendanceDto,
    )
  }

  @Get(':degreeCertificateId')
  findByDegreeCertificateId(
    @Param('degreeCertificateId') degreeCertificateId: string,
  ) {
    return this.degreeCertificateAttendanceService.findByDegreeCertificate(
      +degreeCertificateId,
    )
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateDegreeCertificateAttendanceDto: UpdateDegreeCertificateAttendanceDto,
  ) {
    return this.degreeCertificateAttendanceService.update(
      +id,
      updateDegreeCertificateAttendanceDto,
    )
  }

  @Patch('bulk')
  updateBulk(
    @Body()
    updateDegreeCertificateAttendanceDto: UpdateDegreeCertificateAttendanceDto[],
  ) {
    return this.degreeCertificateAttendanceService.updateBulk(
      updateDegreeCertificateAttendanceDto,
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.degreeCertificateAttendanceService.remove(+id)
  }
}
