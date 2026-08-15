import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { type LoginDto, type RegisterDto } from 'src/libs/contracts';
import {
  BAD_CREDENTIALS,
  UNAUTHORIZED,
  type AuthorizedPayload,
} from '@sorokchat/contracts';
import { type UserModel } from '../users/user.model';
import { verify } from 'argon2';
import { CookieOptions, type Request, type Response } from 'express';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthorizationService {
  private static readonly COOKIE_NAME: string = 'refresh-token';
  private static readonly BASIC_COOKIE_OPTIONS: CookieOptions = {
    secure: true,
    domain: undefined,
    path: '/',
    httpOnly: true,
    sameSite: 'none',
  };

  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) { }

  public async register(
    payload: RegisterDto,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const user = await this.usersService.create(payload);
    return await this.authorize(user, response);
  }

  public async login(
    payload: LoginDto,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const exception = new HttpException(
      BAD_CREDENTIALS,
      HttpStatus.BAD_REQUEST,
    );
    const exists = await this.usersService.getBy({ login: payload.login });
    if (!exists) throw exception;
    const user = await this.usersService.getBy({ login: payload.login });
    const correctPassword = await verify(user.password, payload.password);
    if (!correctPassword) throw exception;
    return await this.authorize(user, response);
  }

  public logout(response: Response): void {
    response.clearCookie(
      AuthorizationService.COOKIE_NAME,
      AuthorizationService.BASIC_COOKIE_OPTIONS,
    );
  }

  public async refreshTokens(
    request: Request,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const method: string = 'Cookie';
    if (!request.cookies) this.unauthorized(response, method);
    const token: string = request.cookies[
      AuthorizationService.COOKIE_NAME
    ] as string;
    if (!token) this.unauthorized(response, method);
    const parsed = await this.tokensService.verifyRefreshToken(token);
    if (parsed === null) this.unauthorized(response, method);
    const user = await this.usersService.getBy({ id: parsed.id ?? undefined });
    return await this.authorize(user, response);
  }

  private async authorize(
    user: UserModel,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(user);
    this.setRefreshToken(refreshToken, response);
    return {
      accessToken,
    };
  }

  public unauthorized(response: Response, method: string): never {
    response.setHeader('WWW-Authenticate', method);
    throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }

  private setRefreshToken(token: string, response: Response): void {
    response.cookie(AuthorizationService.COOKIE_NAME, token, {
      ...AuthorizationService.BASIC_COOKIE_OPTIONS,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
}
