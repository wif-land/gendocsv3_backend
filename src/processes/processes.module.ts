import { Module } from '@nestjs/common'
import { ProcessesService } from './processes.service'
import { ProcessesController } from './processes.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProcessEntity } from './entities/process.entity'
import { FilesModule } from '../files/modules/files.module'
import { YearModuleModule } from '../year-module/year-module.module'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModuleEntity } from '../year-module/entities/submodule-year-module.entity'

@Module({
  controllers: [ProcessesController],
  providers: [ProcessesService],
  imports: [
    TypeOrmModule.forFeature([
      ProcessEntity,
      YearModuleEntity,
      SubmoduleYearModuleEntity,
    ]),
    FilesModule,
    YearModuleModule,
  ],
  exports: [ProcessesService],
})
export class ProcessesModule {}
