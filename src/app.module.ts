import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { LoggerMiddleware } from './shared/utils/logger.middleware'
import { LogModule } from './shared/logs/log.module'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { FilesController } from './files/files.controller'
import { FilesService } from './files/files.service'
import { FilesModule } from './files/files.module'
import { GcpModule } from './gcp/gcp.module'
import { ModulesModule } from './modules/modules.module'
import { CareersModule } from './careers/careers.module'
import { SubmodulesModule } from './submodules/submodules.module'
import { SubmodulesModulesModule } from './submodules-modules/submodules-modules.module'
import { UserAccessModulesModule } from './users-access-modules/users-access-modules.module'
import { FunctionariesModule } from './functionaries/functionaries.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      // entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      autoLoadEntities: true,
      keepConnectionAlive: true,
      // migrationsRun: true,
      // migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
    }),
    LogModule,
    TerminusModule,
    HttpModule,
    AuthModule,
    UsersModule,
    FilesModule,
    GcpModule,
    ModulesModule,
    CareersModule,
    SubmodulesModule,
    SubmodulesModulesModule,
    UserAccessModulesModule,
    FunctionariesModule,
  ],
  controllers: [AppController, FilesController],
  providers: [AppService, LoggerMiddleware, FilesService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('auth/*')
    consumer.apply(LoggerMiddleware).forRoutes('users/*')
  }
}
