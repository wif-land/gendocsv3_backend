import { Module } from '@nestjs/common'
import { GcpService } from './gcp.service'
import { ConfigModule } from '@nestjs/config'
import { GcpController } from './gcp.controller'

@Module({
  providers: [GcpService],
  controllers: [GcpController],
  exports: [GcpService],
  imports: [ConfigModule],
})
export class GcpModule {}
