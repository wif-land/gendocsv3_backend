import { Module } from '@nestjs/common'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'
import { GcpModule } from '../gcp/gcp.module'

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [GcpModule],
})
export class FilesModule {}
