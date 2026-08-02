import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) { }

  public async use(request: Request, _respnse: Response, next: NextFunction) {
    const header = request.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.replace('Bearer ', '');
      const id = await this.tokensService.extractUserIdFromAccessToken(token);
      if (id) {
        const user = await this.usersService.getById(id);
        if (user) {
          request['user'] = user;
        }
      }
    }
    next();
  }
}
