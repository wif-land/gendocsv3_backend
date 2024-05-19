import { Module } from '@nestjs/common'
import { UserAccessModulesService } from './users-access-modules.service'
import { UserAccessModulesController } from './users-access-modules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserAccessModuleEntity } from './entities/user-access-module.entity'

@Module({
  controllers: [UserAccessModulesController],
  providers: [UserAccessModulesService],
  imports: [TypeOrmModule.forFeature([UserAccessModuleEntity])],
  exports: [UserAccessModulesService],
})
export class UserAccessModulesModule {}
