import { Module } from '@nestjs/common'
import { DegreeCertificateAttendanceService } from './degree-certificate-attendance.service'
import { DegreeCertificateAttendanceController } from './degree-certificate-attendance.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DegreeCertificateAttendanceEntity } from './entities/degree-certificate-attendance.entity'

@Module({
  controllers: [DegreeCertificateAttendanceController],
  providers: [DegreeCertificateAttendanceService],
  imports: [TypeOrmModule.forFeature([DegreeCertificateAttendanceEntity])],
  exports: [DegreeCertificateAttendanceService],
})
export class DegreeCertificateAttendanceModule {}
