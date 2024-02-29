import { Module } from '@nestjs/common'
import { PositionsService } from './positions.service'
import { PositionsController } from './positions.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PositionEntity } from './entities/position.entity'
import { FunctionaryEntity } from '../functionaries/entities/functionary.entity'

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [TypeOrmModule.forFeature([PositionEntity, FunctionaryEntity])],
})
export class PositionsModule {}
