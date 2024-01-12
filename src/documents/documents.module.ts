import { Module } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { DocumentsController } from './documents.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentEntity } from './entities/document.entity'

@Module({
  controllers: [DocumentsController],
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  providers: [DocumentsService],
})
export class DocumentsModule {}
