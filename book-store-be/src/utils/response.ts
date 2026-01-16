import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * Send a successful response
 * @param c - Hono context
 * @param data - Response data
 * @param message - Success message
 * @param statusCode - HTTP status code (default: 200)
 */
export const successResponse = (
    c: Context,
    data: any,
    message: string = 'Success',
    statusCode: ContentfulStatusCode = 200
) => {
    return c.json(
        {
            success: true,
            message,
            data,
        },
        statusCode
    );
};

/**
 * Send an error response
 * @param c - Hono context
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 */
export const errorResponse = (
    c: Context,
    message: string = 'An error occurred',
    statusCode: ContentfulStatusCode = 500
) => {
    return c.json(
        {
            success: false,
            message,
        },
        statusCode
    );
};
