import {
  LoginSchema,
  NewChatSchema,
  NewUserSchema,
  UpdateChatSchema,
  UpdateUserSchema,
} from '@sorokchat/contracts';
import { createZodDto } from 'nestjs-zod';

export class NewUserDto extends createZodDto(NewUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }
export class LoginDto extends createZodDto(LoginSchema) { }
export class NewChatDto extends createZodDto(NewChatSchema) { }
export class UpdateChatDto extends createZodDto(UpdateChatSchema) { }
