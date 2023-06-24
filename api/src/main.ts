import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);

  app.enableCors();

  app.use(compression());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:5173',
    credentials: true,
  });


  const config = new DocumentBuilder()
    .setTitle('API TODO LIST - ESGI\'S NestJS APP')
    .setDescription('The API TODO LIST - ESGI\'S NestJS APP description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  const PORT = configService.get('PORT');
  console.info(`Service Product on port: ${PORT}`);
  await app.listen(PORT);
}
bootstrap();
