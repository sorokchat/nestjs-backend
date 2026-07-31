import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from './user.model';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: keyof UserModel | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as UserModel;
    return data ? user[data] : user;
  },
);
