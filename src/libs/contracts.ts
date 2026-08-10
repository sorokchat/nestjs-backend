import { createZodDto } from 'nestjs-zod';
import { NewUserSchema, LoginSchema } from '@sorokchat/contracts';

export class RegisterDto extends createZodDto(NewUserSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
