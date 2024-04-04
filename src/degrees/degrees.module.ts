import { Module } from '@nestjs/common'
import { DegreesService } from './degrees.service'
import { DegreesController } from './degrees.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DegreeEntity } from './entities/degree.entity'

@Module({
  controllers: [DegreesController],
  providers: [DegreesService],
  imports: [TypeOrmModule.forFeature([DegreeEntity])],
})
export class DegreesModule {}
