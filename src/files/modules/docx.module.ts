import { Module } from '@nestjs/common'
import { DocxService } from '../services/docx.service'

@Module({
  providers: [DocxService],
  exports: [DocxService],
})
export class DocxModule {}
