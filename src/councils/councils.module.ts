import { Module } from '@nestjs/common'
import { CouncilsService } from './councils.service'
import { CouncilsController } from './councils.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CouncilEntity } from './entities/council.entity'
import { CouncilAttendanceEntity } from './entities/council-attendance.entity'
import { FilesModule } from '../files/modules/files.module'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModuleEntity } from '../year-module/entities/submodule-year-module.entity'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'
import { StudentEntity } from '../students/entities/student.entity'
import { MailService } from '../mails/mail.service'
import { MailModule } from '../mails/mail.module'

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([
      CouncilEntity,
      CouncilAttendanceEntity,
      YearModuleEntity,
      SubmoduleYearModuleEntity,
      FunctionaryEntity,
      StudentEntity,
    ]),
    MailModule,
  ],
  controllers: [CouncilsController],
  providers: [CouncilsService, MailService],
})
export class CouncilsModule {}
