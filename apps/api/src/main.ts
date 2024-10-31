import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';


async function bootstrap() {
  const globalPrefix = 'api';
  const port = process.env.PORT || 3001;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port);

  Logger.log(
    `🚀 API is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
