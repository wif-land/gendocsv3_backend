import { Module } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { TemplatesController } from './templates.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TemplateProcess } from './entities/template-processes.entity'
import { FilesModule } from '../files/modules/files.module'
import { ProcessesModule } from '../processes/processes.module'

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService],
  imports: [
    TypeOrmModule.forFeature([TemplateProcess]),
    FilesModule,
    ProcessesModule,
  ],
})
export class TemplatesModule {}
