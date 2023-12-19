import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { LoggerMiddleware } from './shared/utils/logger.middleware'
import { LogModule } from './shared/logs/log.module'
import { TerminusModule } from '@nestjs/terminus'

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
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      autoLoadEntities: true,
      keepConnectionAlive: true,
      migrationsRun: true,
      migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
    }),
    LogModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('path/*')
    consumer.apply(LoggerMiddleware).forRoutes('path-two/*')
    consumer.apply(LoggerMiddleware).forRoutes('path-three/*')
    consumer.apply(LoggerMiddleware).forRoutes('path-four/*')
  }
}
