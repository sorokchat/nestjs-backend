import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [TokensService, JwtService, ConfigService],
  exports: [TokensService],
})
export class TokensModule { }
