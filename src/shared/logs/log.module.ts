import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log } from './entities/log.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  exports: [TypeOrmModule],
})
export class LogModule {}
