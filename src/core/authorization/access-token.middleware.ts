import { NestMiddleware, Injectable } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { AuthorizationService } from './authorization.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {}

  public async use(
    request: Request,
    response: Response,
    next: () => void,
  ): Promise<void> {
    const method: string = 'Bearer';
    const header = request.headers['authorization'];
    if (!header) this.authorizationService.unauthorized(response, method);
    const parsed = await this.tokensService.verifyAccessToken(
      header?.replace('Bearer ', ''),
    );
    if (!parsed) this.authorizationService.unauthorized(response, method);
    try {
      const user = await this.usersService.getBy({
        id: parsed.id ?? undefined,
      });
      request['user'] = user;
    } catch {
      this.authorizationService.unauthorized(response, method);
    }
    next();
  }
}
