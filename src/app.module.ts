import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './configurations/validation';
import { UsersModule } from './core/users/users.module';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeormConfiguration } from './configurations/typeorm.configuration';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from './core/tokens/tokens.module';
import { AccessTokenMiddleware } from './core/authorization/access-token.middleware';
import { ChatsModule } from './core/chats/chats.module';
import { ParticipantsModule } from './core/participants/participants.module';

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
    TokensModule,
    ChatsModule,
    ParticipantsModule,
  ],
  providers: [Logger, AccessTokenMiddleware],
  exports: [Logger],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessTokenMiddleware).forRoutes('*');
  }
}
