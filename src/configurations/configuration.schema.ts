import z from 'zod';

const MIN_PORT = 0;
const MAX_PORT = 65535;

export const ConfigurationSchema = z.object({
  PORT: z.coerce
    .number({ message: 'Порт має бути числом' })
    .min(MIN_PORT, { message: `Мінімальне значення порту: ${MIN_PORT}` })
    .max(MAX_PORT, { message: `Максимальне значення порту: ${MAX_PORT}` }),
  DB_HOST: z.string({ message: 'Посилання на базу данних має бути' }),
  DB_PORT: z.coerce
    .number({ message: 'Порт бази даних має бути числом' })
    .min(MIN_PORT, {
      message: `Мінімальне значення порту бази даних: ${MIN_PORT}`,
    })
    .max(MAX_PORT, {
      message: `Максимальне значення порту бази даних: ${MAX_PORT}`,
    }),
  DB_USERNAME: z.string({ message: "Ім'я користувача бази даних має бути" }),
  DB_PASSWORD: z.string({ message: 'Пароль бази даних має бути' }),
  DB_NAME: z.string({ message: "Ім'я бази даних має бути" }),
  JWT_ACCESS_SECRET: z.string({ message: 'Ключ доступа має бути рядком' }),
  JWT_ACCESS_EXPIRES_IN: z.string({
    message: 'Термін дії токену доступу має бути рядком',
  }),
  JWT_REFRESH_SECRET: z.string({ message: 'Ключ оновлення має бути рядком' }),
  JWT_REFRESH_EXPIRES_IN: z.string({
    message: 'Термін дії токену оновлення має бути рядком',
  }),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
