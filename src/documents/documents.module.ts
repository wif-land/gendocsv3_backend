import { Module } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { DocumentsController } from './documents.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentEntity } from './entities/document.entity'
import { DocumentFunctionaryEntity } from './entities/document-functionary.entity'
import { NumerationDocumentModule } from '../numeration-document/numeration-document.module'
import { VariablesModule } from '../variables/variables.module'
import { FilesModule } from '../files/files.module'

@Module({
  controllers: [DocumentsController],
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, DocumentFunctionaryEntity]),
    NumerationDocumentModule,
    VariablesModule,
    FilesModule,
  ],
  providers: [DocumentsService],
})
export class DocumentsModule {}
