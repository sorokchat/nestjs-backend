import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({}), ConfigModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
