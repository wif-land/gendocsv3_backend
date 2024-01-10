import { Module } from '@nestjs/common'
import { NumerationDocumentService } from './numeration-document.service'
import { NumerationDocumentController } from './numeration-document.controller'

@Module({
  controllers: [NumerationDocumentController],
  providers: [NumerationDocumentService],
})
export class NumerationDocumentModule {}
