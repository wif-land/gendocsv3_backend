import { Module } from '@nestjs/common'
import { ProcessesService } from './processes.service'
import { ProcessesController } from './processes.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Process } from './entities/process.entity'
import { FilesModule } from '../files/files.module'

@Module({
  controllers: [ProcessesController],
  providers: [ProcessesService],
  imports: [TypeOrmModule.forFeature([Process]), FilesModule],
})
export class ProcessesModule {}
