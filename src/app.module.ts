// eslint-disable-next-line filenames/match-exported
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { LoggerMiddleware } from './shared/utils/logger.middleware'
import { LogModule } from './shared/logs/log.module'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { FilesController } from './files/files.controller'
import { FilesService } from './files/services/files.service'
import { FilesModule } from './files/modules/files.module'
import { GcpModule } from './gcp/gcp.module'
import { ModulesModule } from './modules/modules.module'
import { CareersModule } from './careers/careers.module'
import { SubmodulesModule } from './submodules/submodules.module'
import { SubmodulesModulesModule } from './submodules-modules/submodules-modules.module'
import { UserAccessModulesModule } from './users-access-modules/users-access-modules.module'
import { FunctionariesModule } from './functionaries/functionaries.module'
import { StudentsModule } from './students/students.module'
import { DataSource, DataSourceOptions } from 'typeorm'
import { config as dotenvConfig } from 'dotenv'
import { ProcessesModule } from './processes/processes.module'
import { TemplatesModule } from './templates/templates.module'
import { YearModuleModule } from './year-module/year-module.module'
import { VariablesModule } from './variables/variables.module'
import { CouncilsModule } from './councils/councils.module'
import { NumerationDocumentModule } from './numeration-document/numeration-document.module'
import { DocumentsModule } from './documents/documents.module'
import { PositionsModule } from './positions/positions.module'
import { DegreesModule } from './degrees/degrees.module'
import { CitiesModule } from './cities/cities.module'
import { DegreeCertificatesModule } from './degree-certificates/degree-certificates.module'
import { CouncilsAttendanceModule } from './council-attendance/module'
import { DegreeCertificateAttendanceModule } from './degree-certificate-attendance/degree-certificate-attendance.module'
import { FileSystemModule } from './files/modules/file-system.module'
import { DocxModule } from './files/modules/docx.module'
import { EmailService } from './email/email.service'
import { EmailModule } from './email/email.module'

dotenvConfig({ path: '.env' })

const config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: !!process.env.DATABASE_SYNCHRONIZE,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  keepConnectionAlive: true,
  migrationsRun: false,
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  migrationsTableName: 'migrations',
}

const connectionSource = new DataSource(config as DataSourceOptions)
export default connectionSource

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      ...config,
      dropSchema: process.env.DROP_SCHEMA === 'true',
    } as TypeOrmModuleOptions),
    LogModule,
    TerminusModule,
    HttpModule,
    AuthModule,
    UsersModule,
    FilesModule,
    FileSystemModule,
    DocxModule,
    GcpModule,
    ModulesModule,
    CareersModule,
    SubmodulesModule,
    SubmodulesModulesModule,
    UserAccessModulesModule,
    FunctionariesModule,
    StudentsModule,
    ProcessesModule,
    TemplatesModule,
    YearModuleModule,
    VariablesModule,
    CouncilsModule,
    NumerationDocumentModule,
    DocumentsModule,
    PositionsModule,
    DegreesModule,
    CitiesModule,
    DegreeCertificatesModule,
    CouncilsAttendanceModule,
    DegreeCertificateAttendanceModule,
    EmailModule,
  ],
  controllers: [AppController, FilesController],
  providers: [AppService, LoggerMiddleware, FilesService, EmailService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'staging'
    ) {
      consumer.apply(LoggerMiddleware).forRoutes('users/*')
      consumer.apply(LoggerMiddleware).forRoutes('auth/*')
      consumer.apply(LoggerMiddleware).forRoutes('careers/*')
      consumer.apply(LoggerMiddleware).forRoutes('modules/*')
    }
  }
}
