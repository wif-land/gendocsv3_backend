import { Module } from '@nestjs/common'
import { UserAccessModulesService } from './user-access-modules.service'
import { UserAccessModulesController } from './user-access-modules.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserAccessModule } from './entities/user-access-module.entity'

@Module({
  controllers: [UserAccessModulesController],
  providers: [UserAccessModulesService],
  imports: [TypeOrmModule.forFeature([UserAccessModule])],
})
export class UserAccessModulesModule {}
