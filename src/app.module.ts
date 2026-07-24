import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './configurations/validation';
import { UsersModule } from './core/users/users.module';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeormConfiguration } from './configurations/typeorm.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, expandVariables: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeormConfiguration,
    }),
    UsersModule,
    AuthorizationModule,
  ],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
