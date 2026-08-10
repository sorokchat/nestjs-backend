import { Injectable } from '@nestjs/common';
import { JwtVerifyOptions, JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { type UserModel } from '../users/user.model';
import { type Tokens } from './tokens.type';
import { ConfigService } from '@nestjs/config';
import { type Configuration } from 'src/configurations/configuration.schema';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  public async generateTokens(user: UserModel): Promise<Tokens> {
    const accessToken = await this.generateToken(
      user,
      this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
    );
    const refreshToken = await this.generateToken(
      user,
      this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    );
    return { accessToken, refreshToken };
  }

  public async verifyAccessToken(
    token: string,
  ): Promise<Pick<UserModel, 'id'> | null> {
    return await this.verifyToken(
      token,
      this.configService.getOrThrow('JWT_ACCESS_SECRET'),
    );
  }

  public async verifyRefreshToken(
    token: string,
  ): Promise<Pick<UserModel, 'id'> | null> {
    return await this.verifyToken(
      token,
      this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    );
  }

  private async verifyToken(
    token: string,
    secret: JwtVerifyOptions['secret'],
  ): Promise<Pick<UserModel, 'id'> | null> {
    try {
      return await this.jwtService.verifyAsync<Pick<UserModel, 'id'>>(token, {
        secret,
      });
    } catch {
      return null;
    }
  }

  private async generateToken(
    user: UserModel,
    secret: JwtSignOptions['secret'],
    expiresAt: JwtSignOptions['expiresIn'],
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { id: user.id },
      { secret, expiresIn: expiresAt },
    );
  }
}
