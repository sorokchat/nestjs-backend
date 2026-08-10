import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './configurations/configuration.schema';
import { INestApplication, Logger } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { resolveNestJsOpenApi } from '@sorokchat/contracts';

async function setupSwagger(app: INestApplication<unknown>): Promise<void> {
  const document = await resolveNestJsOpenApi('localhost:8080');
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupSwagger(app);
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.useGlobalPipes(new ZodValidationPipe());
  const logger = app.get(Logger);
  const configService = app.get(ConfigService<Configuration>);
  const port = configService.getOrThrow('PORT', { infer: true });
  await app.listen(port, () =>
    logger.log(`Сервер запустився на ${port} порту`),
  );
}
void bootstrap();
