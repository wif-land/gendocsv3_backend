import { Module } from '@nestjs/common'
import { AttendanceService } from './service'
import { CouncilsAttendanceController } from './controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilesModule } from '../files/modules/files.module'
import { CouncilAttendanceEntity } from '../councils/entities/council-attendance.entity'
import { CouncilEntity } from '../councils/entities/council.entity'
import { EmailService } from '../email/services/email.service'
import { EmailModule } from '../email/email.module'

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([CouncilEntity, CouncilAttendanceEntity]),
    EmailModule,
  ],
  controllers: [CouncilsAttendanceController],
  providers: [AttendanceService, EmailService],
})
export class CouncilsAttendanceModule {}
