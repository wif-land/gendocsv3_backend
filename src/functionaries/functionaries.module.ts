import { Module } from '@nestjs/common'
import { FunctionariesService } from './functionaries.service'
import { FunctionariesController } from './functionaries.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Functionary } from './entities/functionary.entity'

@Module({
  controllers: [FunctionariesController],
  providers: [FunctionariesService],
  imports: [TypeOrmModule.forFeature([Functionary])],
})
export class FunctionariesModule {}
