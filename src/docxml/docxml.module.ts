import { Module } from '@nestjs/common'
import { DocxmlService } from './docxml.service'

@Module({
  providers: [DocxmlService],
})
export class DocxmlModule {}
