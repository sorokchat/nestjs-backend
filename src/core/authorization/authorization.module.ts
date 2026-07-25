import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationController } from './authorization.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthorizationController],
  providers: [AuthorizationService, JwtService],
  imports: [UsersModule],
})
export class AuthorizationModule {}
