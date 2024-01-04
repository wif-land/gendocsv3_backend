import { Module } from '@nestjs/common'
import { SubmodulesService } from './submodules.service'
import { SubmodulesController } from './submodules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Submodule } from './entities/submodule.entity'

@Module({
  controllers: [SubmodulesController],
  providers: [SubmodulesService],
  exports: [SubmodulesService],
  imports: [TypeOrmModule.forFeature([Submodule])],
})
export class SubmodulesModule {}
