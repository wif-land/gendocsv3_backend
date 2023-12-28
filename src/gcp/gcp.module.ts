import { Module } from '@nestjs/common'
import { GcpService } from './gcp.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [GcpService],
  exports: [GcpService],
  imports: [ConfigModule],
})
export class GcpModule {}
