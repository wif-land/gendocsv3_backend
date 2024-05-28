import { Module } from '@nestjs/common'
import { FilesController } from './files.controller'
import { FilesService } from './services/files.service'
import { GcpModule } from '../gcp/gcp.module'
import { FileSystemService } from './services/file-system.service'
import { DocxService } from './services/docx.service'

@Module({
  controllers: [FilesController],
  providers: [FilesService, FileSystemService, DocxService],
  imports: [GcpModule],
  exports: [FilesService],
})
export class FilesModule {}
