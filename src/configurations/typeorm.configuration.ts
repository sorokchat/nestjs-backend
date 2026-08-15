import { ConfigService } from '@nestjs/config';
import { Configuration } from './configuration.schema';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeormConfiguration(
  configService: ConfigService<Configuration>,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.getOrThrow('DB_HOST', { infer: true }),
    port: configService.getOrThrow('DB_PORT', { infer: true }),
    username: configService.getOrThrow('DB_USERNAME', { infer: true }),
    password: configService.getOrThrow('DB_PASSWORD', { infer: true }),
    database: configService.getOrThrow('DB_NAME', { infer: true }),
    synchronize: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    ssl: {
      rejectUnauthorized: false,
    },
  };
}
