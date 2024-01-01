import { Module } from '@nestjs/common'
import { UserAccessModulesService } from './user-access-modules.service'
import { UserAccessModulesController } from './user-access-modules.controller'

@Module({
  controllers: [UserAccessModulesController],
  providers: [UserAccessModulesService],
})
export class UserAccessModulesModule {}
