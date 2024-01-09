import { Module } from '@nestjs/common'
import { ModulesService } from './modules.service'
import { ModulesController } from './modules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module as ModuleEntity } from './entities/modules.entity'
import { GcpModule } from '../gcp/gcp.module'
import { YearModuleModule } from '../year-module/year-module.module'

@Module({
  providers: [ModulesService],
  controllers: [ModulesController],
  imports: [
    TypeOrmModule.forFeature([ModuleEntity]),
    GcpModule,
    YearModuleModule,
  ],
  exports: [ModulesService],
})
export class ModulesModule {}
