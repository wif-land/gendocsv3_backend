import { Module } from '@nestjs/common'
import { CouncilsService } from './councils.service'
import { CouncilsController } from './councils.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CouncilEntity } from './entities/council.entity'
import { CouncilAttendanceEntity } from './entities/council-attendance.entity'
import { FilesModule } from '../files/files.module'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModuleEntity } from '../year-module/entities/submodule-year-module.entity'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'

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
  controllers: [CouncilsController],
  providers: [CouncilsService],
})
export class CouncilsModule {}
