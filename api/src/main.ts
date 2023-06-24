import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  const PORT = configService.get('PORT');
  console.info(`Service Product on port: ${PORT}`);
  await app.listen(PORT);
}
bootstrap();
