import './instrument';

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ConsoleLogger,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'iWebHub', // Default is "Nest"
    }),
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  // Use cookie parser
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('iWebHub')
    .setDescription('The iWebHub API description')
    .setVersion('1.0')
    .addTag('iWebHub')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Error during application startup:', error.message);
  } else {
    console.error('An unknown error occurred during application startup');
  }
  process.exit(1);
});
