import { Module } from '@nestjs/common'
import { CouncilsService } from './councils.service'
import { CouncilsController } from './councils.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CouncilEntity } from './entities/council.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CouncilEntity])],
  controllers: [CouncilsController],
  providers: [CouncilsService],
})
export class CouncilsModule {}
