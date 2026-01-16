import type { Context, Next } from 'hono';
import type { ZodSchema } from 'zod';
import { errorResponse } from '../utils/response';

/**
 * Middleware to validate request body against a Zod schema
 * @param schema - Zod validation schema
 */
export const validateRequest = (schema: ZodSchema) => {
    return async (c: Context, next: Next) => {
        try {
            const body = await c.req.json();

            const validatedData = schema.parse(body);
            
            c.set('validatedData', validatedData);
            
            await next();
        } catch (error: any) {
            console.error('Validation error:', error);
            if (error.errors) {
                console.error('Zod validation errors:', error.errors);
                const errorMessages = error.errors.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                
                return c.json(
                    {
                        success: false,
                        message: 'Validation failed',
                        errors: errorMessages,
                    },
                    400
                );
            }
            
            console.error('Non-zod error:', error.message);
            return errorResponse(c, 'Invalid request data', 400);
        }
    };
};
