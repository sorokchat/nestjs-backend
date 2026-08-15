import { NestMiddleware, Injectable } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) { }

  public async use(
    request: Request,
    _response: Response,
    next: () => void,
  ): Promise<void> {
    const header = request.headers.authorization;
    if (!header) return next();
    if (typeof header !== 'string') return next();
    const parsed = await this.tokensService.verifyAccessToken(
      header.replace('Bearer ', ''),
    );
    if (!parsed) return next();
    try {
      const user = await this.usersService.getBy({
        id: parsed.id ?? undefined,
      });
      request['user'] = user;
    } catch {
      next();
    }
    next();
  }
}
