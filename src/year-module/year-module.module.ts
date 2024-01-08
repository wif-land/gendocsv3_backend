import { Module } from '@nestjs/common'
import { YearModuleService } from './year-module.service'
import { YearModuleController } from './year-module.controller'

@Module({
  controllers: [YearModuleController],
  providers: [YearModuleService],
})
export class YearModuleModule {}
