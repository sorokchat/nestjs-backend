import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

class AuthenticatedGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp();
    return !!request;
  }
}

export const Authenticated = UseGuards(AuthenticatedGuard);
