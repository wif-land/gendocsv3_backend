import { Module } from '@nestjs/common'
import { FileSystemService } from './file-system.service'
import { FileSystemController } from './file-system.controller'
import { GcpModule } from '../gcp/gcp.module'

@Module({
  providers: [FileSystemService],
  exports: [FileSystemService],
  controllers: [FileSystemController],
  imports: [GcpModule],
})
export class FileSystemModule {}
