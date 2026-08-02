import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, NewUserDto } from 'src/libs/contracts';
import { AuthorizedPayload } from '@sorokchat/contracts';
import { UserModel } from '../users/user.model';
import { Request, Response } from 'express';
import { BAD_CREDENTIALS, UNAUTHORIZED } from './authorization.messages';
import { verify } from 'argon2';
import { TokensService } from '../tokens/tokens.service';
import {
  AUTHORIZATION_CONTROLLER,
  AUTHORIZATION_ROUTES,
} from './authorization.api';

@Injectable()
export class AuthorizationService {
  private static COOKIE_NAME: string = '__Host-refresh-token';

  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) { }

  public async register(
    payload: NewUserDto,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const createdUser = await this.usersService.create(payload);
    response.setHeaders(
      new Map<string, string>([
        [
          'Location',
          `${AUTHORIZATION_CONTROLLER}/${AUTHORIZATION_ROUTES.PROFILE}`,
        ],
      ]),
    );
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

  public async refreshTokens(
    request: Request,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const cookies = request.cookies;
    if (cookies[AuthorizationService.COOKIE_NAME]) {
      const refreshToken: string = cookies[
        AuthorizationService.COOKIE_NAME
      ] as string;
      const userId =
        await this.tokensService.extractUserIdFromRefreshToken(refreshToken);
      if (userId !== null) {
        const user = await this.usersService.getById(userId);
        return await this.authenticate(user, response);
      }
    }
    response.setHeaders(
      new Map<string, string>([['WWW-Authenticate', 'Cookie']]),
    );
    throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }

  private async authenticate(
    user: UserModel,
    response: Response,
  ): Promise<AuthorizedPayload> {
    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(user);
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
