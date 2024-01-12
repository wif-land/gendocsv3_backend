import { Module } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { TemplatesController } from './templates.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TemplateProcess } from './entities/template-processes.entity'
import { FilesModule } from '../files/files.module'

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService],
  imports: [TypeOrmModule.forFeature([TemplateProcess]), FilesModule],
})
export class TemplatesModule {}
