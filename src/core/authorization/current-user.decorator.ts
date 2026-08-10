import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type UserModel } from '../users/user.model';
import { type Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: keyof UserModel, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as UserModel;
    return data ? user[data] : user;
  },
);
