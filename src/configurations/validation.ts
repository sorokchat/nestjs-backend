import z from 'zod';
import { ConfigurationSchema } from './configuration.schema';

export function validate(config: Record<string, unknown>) {
  try {
    return ConfigurationSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues
        .map((err) => ` - ${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(
        `Помилка перевірки змінних оточення: \n${formattedErrors}`,
      );
    }
    throw error;
  }
}
