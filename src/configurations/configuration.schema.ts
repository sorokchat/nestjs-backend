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
  DB_USERNAME: z.string("Ім'я користувача бази даних має бути"),
  DB_PASSWORD: z.string('Пароль бази даних має бути'),
  DB_NAME: z.string("Ім'я бази даних має бути"),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
