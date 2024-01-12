import { Module } from '@nestjs/common'
import { NumerationDocumentService } from './numeration-document.service'
import { NumerationDocumentController } from './numeration-document.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NumerationDocumentEntity } from './entities/numeration-document.entity'
import { CouncilEntity } from '../councils/entities/council.entity'

@Module({
  controllers: [NumerationDocumentController],
  imports: [
    TypeOrmModule.forFeature([NumerationDocumentEntity, CouncilEntity]),
  ],
  providers: [NumerationDocumentService],
})
export class NumerationDocumentModule {}
