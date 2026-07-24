import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './configurations/configuration.schema';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const logger = app.get(Logger);
  const configService = app.get(ConfigService<Configuration>);
  const port = configService.getOrThrow('PORT', { infer: true });
  await app.listen(port, () =>
    logger.log(`Сервер запустився на ${port} порту`),
  );
}
bootstrap();
