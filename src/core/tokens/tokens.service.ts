import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Configuration } from 'src/configurations/configuration.schema';
import { UserModel } from '../users/user.model';

export type TokensPayload = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class TokensService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenDuration: JwtSignOptions['expiresIn'];
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenDuration: JwtSignOptions['expiresIn'];

  constructor(
    configService: ConfigService<Configuration>,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenSecret = configService.getOrThrow('JWT_ACCESS_SECRET', {
      infer: true,
    });
    this.accessTokenDuration = configService.getOrThrow(
      'JWT_ACCESS_EXPIRES_IN',
      { infer: true },
    );
    this.refreshTokenSecret = configService.getOrThrow('JWT_REFRESH_SECRET', {
      infer: true,
    });
    this.refreshTokenDuration = configService.getOrThrow(
      'JWT_REFRESH_EXPIRES_IN',
      { infer: true },
    );
  }

  public async generateTokens(user: UserModel): Promise<TokensPayload> {
    const accessToken = await this.generateToken(
      user,
      this.accessTokenSecret,
      this.accessTokenDuration,
    );
    const refreshToken = await this.generateToken(
      user,
      this.refreshTokenSecret,
      this.refreshTokenDuration,
    );
    return { accessToken, refreshToken };
  }

  public async extractUserId(accessToken: string): Promise<number | null> {
    try {
      const { id } = await this.jwtService.verifyAsync<{ id: number }>(
        accessToken,
      );
      return id;
    } catch {
      return null;
    }
  }

  private async generateToken(
    user: UserModel,
    secret: string,
    expiresIn: JwtSignOptions['expiresIn'],
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { id: user.id },
      { secret, expiresIn },
    );
  }
}
