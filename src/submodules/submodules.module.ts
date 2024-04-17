import { Module } from '@nestjs/common'
import { SubmodulesService } from './submodules.service'
import { SubmodulesController } from './submodules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubmoduleEntity } from './entities/submodule.entity'

@Module({
  controllers: [SubmodulesController],
  providers: [SubmodulesService],
  exports: [SubmodulesService],
  imports: [TypeOrmModule.forFeature([SubmoduleEntity])],
})
export class SubmodulesModule {}
