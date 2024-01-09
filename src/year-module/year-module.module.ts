import { Module } from '@nestjs/common'
import { YearModuleService } from './year-module.service'
import { YearModuleController } from './year-module.controller'
import { GcpModule } from '../gcp/gcp.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { YearModuleEntity } from './entities/year-module.entity'
import { SubmoduleYearModuleEntity } from './entities/submodule-year-module.entity'

@Module({
  controllers: [YearModuleController],
  imports: [
    TypeOrmModule.forFeature([YearModuleEntity, SubmoduleYearModuleEntity]),
    GcpModule,
  ],
  exports: [YearModuleService],
  providers: [YearModuleService],
})
export class YearModuleModule {}
