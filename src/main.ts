import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './core/middleware/http-exception'

const buildOptions = () =>
  new DocumentBuilder()
    .setTitle('GenDocs API')
    .setDescription('GenDocs API documentation')
    .setVersion('3.0')
    .addBearerAuth()
    .build()

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.useGlobalFilters(new AllExceptionsFilter())
  app.enableShutdownHooks()
  app.enableCors()

  const options = buildOptions()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(app.get(ConfigService).get('port'))
  logger.log(
    `Application listening on port ${app.get(ConfigService).get('port')}`,
  )
}

bootstrap()
