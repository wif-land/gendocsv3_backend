import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/users.entity'
import { UsersController } from './users.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserAccessModulesModule } from '../users-access-modules/users-access-modules.module'
import { FilesModule } from '../files/modules/files.module'
import { UsersGateway } from './users.gateway'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
    UserAccessModulesModule,
    FilesModule,
  ],
  providers: [UsersService, UsersGateway],
  exports: [UsersService, UsersGateway],
  controllers: [UsersController],
})
export class UsersModule {}
