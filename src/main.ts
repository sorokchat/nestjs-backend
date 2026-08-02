import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './configurations/configuration.schema';
import { INestApplication, Logger } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import cookieParser from 'cookie-parser';

function setupSwagger(app: INestApplication<unknown>): void {
  const yamlPath = path.resolve(process.cwd(), 'openapi.yaml');
  const yamlFile = fs.readFileSync(yamlPath, 'utf8');
  const document = yaml.load(yamlFile) as OpenAPIObject;
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
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
