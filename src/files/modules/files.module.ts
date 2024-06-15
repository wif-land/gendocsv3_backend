import { Module } from '@nestjs/common'
import { FilesController } from '../files.controller'
import { FilesService } from '../services/files.service'
import { GcpModule } from '../../gcp/gcp.module'
import { FileSystemModule } from './file-system.module'
import { DocxModule } from './docx.module'
import { ExcelService } from '../services/excel.service'

@Module({
  controllers: [FilesController],
  providers: [FilesService, ExcelService],
  imports: [GcpModule, FileSystemModule, DocxModule],
  exports: [FilesService, ExcelService],
})
export class FilesModule {}
