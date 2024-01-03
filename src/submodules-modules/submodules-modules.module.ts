import { Module } from '@nestjs/common'
import { SubmodulesModulesService } from './submodules-modules.service'
import { SubmodulesModulesController } from './submodules-modules.controller'
import { SubmodulesModule } from './entities/submodule-module.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  controllers: [SubmodulesModulesController],
  providers: [SubmodulesModulesService],
  exports: [SubmodulesModulesService],
  imports: [TypeOrmModule.forFeature([SubmodulesModule])],
})
export class SubmodulesModulesModule {}
