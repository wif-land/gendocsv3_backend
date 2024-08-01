import { Module } from '@nestjs/common'
import { CareersService } from './careers.service'
import { CareersController } from './careers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CareerEntity } from './entites/careers.entity'
import { ModulesModule } from '../modules/modules.module'
import { FilesModule } from '../files/modules/files.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CareerEntity]),
    ModulesModule,
    FilesModule,
  ],
  providers: [CareersService],
  controllers: [CareersController],
})
export class CareersModule {}
