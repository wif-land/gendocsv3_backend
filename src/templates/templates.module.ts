import { Module } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { TemplatesController } from './templates.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Template } from './entities/template.entity'

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService],
  imports: [TypeOrmModule.forFeature([Template])],
})
export class TemplatesModule {}
