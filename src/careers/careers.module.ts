import { Module } from '@nestjs/common'
import { CareersService } from './careers.service'
import { CareersController } from './careers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Career } from './entites/careers.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Career])],
  providers: [CareersService],
  controllers: [CareersController],
})
export class CareersModule {}
