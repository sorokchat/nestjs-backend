import z from 'zod';

const MIN_PORT = 0;
const MAX_PORT = 65535;

export const ConfigurationSchema = z.object({
  PORT: z.coerce
    .number({ message: 'Порт має бути числом' })
    .min(MIN_PORT, { message: `Мінімальне значення порта: ${MIN_PORT}` })
    .max(MAX_PORT, { message: `Максимальне значення порту: ${MAX_PORT}` }),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
