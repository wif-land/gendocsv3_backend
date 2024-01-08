import { Module } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { TemplatesController } from './templates.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TemplateProcess } from './entities/template-processes.entity'

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService],
  imports: [TypeOrmModule.forFeature([TemplateProcess])],
})
export class TemplatesModule {}
