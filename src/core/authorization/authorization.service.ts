import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, NewUserDto } from 'src/libs/contracts';
import { AuthorizedPayload } from '@sorokchat/contracts';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../users/user.model';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/configurations/configuration.schema';
import { Response } from 'express';
import { BAD_CREDENTIALS } from './authorization.messages';
import { verify } from 'argon2';

@Injectable()
export class AuthorizationService {
  private static COOKIE_NAME: string = '__Host-refresh-token';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  public async register(
    payload: NewUserDto,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const createdUser = await this.usersService.create(payload);
    return await this.authenticate(createdUser, response);
  }

  public async login(
    payload: LoginDto,
    response: Response,
  ): Promise<AuthorizedPayload> {
    try {
      const user = await this.usersService.getByLogin(payload.login);
      const correctPassword = await verify(user.password, payload.password);
      if (!correctPassword) {
        throw new HttpException(BAD_CREDENTIALS, HttpStatus.UNAUTHORIZED);
      }
      return this.authenticate(user, response);
    } catch {
      throw new HttpException(BAD_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
  }

  public logout(response: Response): void {
    response.clearCookie(AuthorizationService.COOKIE_NAME, {
      httpOnly: true,
      domain: undefined,
      path: '/',
      secure: true,
      maxAge: 0,
    });
  }

  private async authenticate(
    user: UserModel,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const accessToken = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN', {
          infer: true,
        }),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN', {
          infer: true,
        }),
      },
    );
    response.cookie(AuthorizationService.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      domain: undefined,
      path: '/',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return { accessToken };
  }
}
