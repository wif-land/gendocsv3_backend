import { Module } from '@nestjs/common'
import { VariablesService } from './variables.service'
import { VariablesController } from './variables.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VariableEntity } from './entities/variable.entity'

@Module({
  controllers: [VariablesController],
  imports: [TypeOrmModule.forFeature([VariableEntity])],
  exports: [VariablesService],
  providers: [VariablesService],
})
export class VariablesModule {}
