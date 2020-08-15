import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // cleans the request payloads from non existing attributes in DTOs
    forbidNonWhitelisted: true, // throw an error when the request payloads has non existing attributes in DTOs
    transform: true
  }));
  await app.listen(3000);
}
bootstrap();
