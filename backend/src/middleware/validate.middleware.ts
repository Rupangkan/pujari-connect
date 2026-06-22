import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema } from 'zod';
import { AppError } from './error.middleware.js';

/**
 * Zod validation middleware factory.
 * Validates request body, query, or params against a Zod schema.
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // Replace the parsed/transformed data back
      (req as Record<string, unknown>)[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(
          new AppError(
            `Validation failed: ${formattedErrors.map((e) => `${e.field}: ${e.message}`).join(', ')}`,
            400
          )
        );
        return;
      }
      next(error);
    }
  };
}
