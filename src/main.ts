import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

const buildOptions = () =>
  new DocumentBuilder()
    .setTitle('GenDocs API')
    .setDescription('GenDocs API documentation')
    .setVersion('3.0')
    .addBearerAuth()
    .build()

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  const options = buildOptions()
  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('api', app, document)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  app.enableShutdownHooks()
  app.enableCors()

  await app.listen(app.get(ConfigService).get('port'))
}

bootstrap()
