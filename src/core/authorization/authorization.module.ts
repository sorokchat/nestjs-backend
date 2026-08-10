import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { AccessTokenMiddleware } from './access-token.middleware';

@Module({
  imports: [UsersModule, TokensModule],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, AccessTokenMiddleware],
  exports: [AccessTokenMiddleware, AuthorizationService],
})
export class AuthorizationModule {}
