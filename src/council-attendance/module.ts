import { Module } from '@nestjs/common'
import { AttendanceService } from './service'
import { CouncilsAttendanceController } from './controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilesModule } from '../files/files.module'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModuleEntity } from '../year-module/entities/submodule-year-module.entity'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'
import { CouncilAttendanceEntity } from '../councils/entities/council-attendance.entity'
import { CouncilEntity } from '../councils/entities/council.entity'

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([
      CouncilEntity,
      CouncilAttendanceEntity,
      YearModuleEntity,
      SubmoduleYearModuleEntity,
      FunctionaryEntity,
    ]),
  ],
  controllers: [CouncilsAttendanceController],
  providers: [AttendanceService],
})
export class CouncilsAttendanceModule {}
