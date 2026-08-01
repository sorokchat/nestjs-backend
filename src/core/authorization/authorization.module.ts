import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  controllers: [AuthorizationController],
  providers: [AuthorizationService],
  imports: [UsersModule, TokensModule],
})
export class AuthorizationModule { }
