import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './configurations/validation';
import { UsersModule } from './core/users/users.module';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeormConfiguration } from './configurations/typeorm.configuration';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, expandVariables: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeormConfiguration,
    }),
    JwtModule.register({}),
    UsersModule,
    AuthorizationModule,
  ],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
