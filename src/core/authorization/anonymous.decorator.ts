import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

class AnonymousGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    return !request['user'];
  }
}

export const Anonymous = () => UseGuards(AnonymousGuard);
