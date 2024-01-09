import { Module } from '@nestjs/common'
import { CouncilsService } from './councils.service'
import { CouncilsController } from './councils.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CouncilEntity } from './entities/council.entity'
import { CouncilAttendanceEntity } from './entities/council-attendance.entity'
import { FilesModule } from '../files/files.module'
import { ModuleEntity } from '../modules/entities/modules.entity'

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([
      CouncilEntity,
      CouncilAttendanceEntity,
      ModuleEntity,
    ]),
  ],
  controllers: [CouncilsController],
  providers: [CouncilsService],
})
export class CouncilsModule {}
