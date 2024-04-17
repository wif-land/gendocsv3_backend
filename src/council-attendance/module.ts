import { Module } from '@nestjs/common'
import { AttendanceService } from './service'
import { CouncilsAttendanceController } from './controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilesModule } from '../files/files.module'
import { CouncilAttendanceEntity } from '../councils/entities/council-attendance.entity'
import { CouncilEntity } from '../councils/entities/council.entity'

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([CouncilEntity, CouncilAttendanceEntity]),
  ],
  controllers: [CouncilsAttendanceController],
  providers: [AttendanceService],
})
export class CouncilsAttendanceModule {}
