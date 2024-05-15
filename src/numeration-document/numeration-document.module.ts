import { Module } from '@nestjs/common'
import { NumerationDocumentService } from './numeration-document.service'
import { NumerationDocumentController } from './numeration-document.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NumerationDocumentEntity } from './entities/numeration-document.entity'
import { CouncilEntity } from '../councils/entities/council.entity'
import { YearModuleModule } from '../year-module/year-module.module'

@Module({
  controllers: [NumerationDocumentController],
  imports: [
    TypeOrmModule.forFeature([NumerationDocumentEntity, CouncilEntity]),
    YearModuleModule,
  ],
  exports: [NumerationDocumentService],
  providers: [NumerationDocumentService],
})
export class NumerationDocumentModule {}
