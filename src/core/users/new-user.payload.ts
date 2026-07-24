import z from 'zod';

export const NewUserSchema = z.object({
  login: z.string(),
  password: z.string(),
  displayName: z.string().optional(),
});

export type NewUserPaylod = z.infer<typeof NewUserSchema>;
