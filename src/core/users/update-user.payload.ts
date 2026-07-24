import z from 'zod';
import { NewUserSchema } from './new-user.payload';

export const UpdateUserSchema = NewUserSchema.partial();
export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>;
