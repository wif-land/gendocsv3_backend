import { Module } from '@nestjs/common'
import { FilesController } from './files.controller'
import { FilesService } from './services/files.service'
import { GcpModule } from '../gcp/gcp.module'

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [GcpModule],
  exports: [FilesService],
})
export class FilesModule {}
