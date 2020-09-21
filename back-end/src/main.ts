import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.static(join(process.cwd(), './avatars/')));
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
