import type { Context } from "hono";
import { AuthService } from "./auth.service";
import { successResponse, errorResponse } from "../../utils/response";

const authService = new AuthService();

export class AuthController {
    async login(c: Context) {
        try {
            const data = c.get('validatedData');
            const result = await authService.login(data);
            return successResponse(c, result, 'Login successful');
        } catch (error) {
            return errorResponse(c, error instanceof Error ? error.message : 'Login failed', 401);
        }
    }

    async register(c: Context) {
        try {
            const data = c.get('validatedData');
            const result = await authService.register(data);
           return successResponse(c, result, 'Registration successful');
        } catch (error) {
            return errorResponse(c, error instanceof Error ? error.message : 'Registration failed', 400);
        }
    }

    async logout(c: Context) {
        try {
            const jti = c.get('jti');
            const result = await authService.logout(jti);
            return successResponse(c, result, 'Logout successful');
        } catch (error) {
            return errorResponse(c, error instanceof Error ? error.message : 'Logout failed', 400);
        }
    }

    async forgetPassword(c: Context) {
        try {
            const data = c.get('validatedData');
            const result = await authService.forgetPassword(data);
            return successResponse(c, result, 'OTP sent successfully');
        } catch (error) {
            return errorResponse(c, error instanceof Error ? error.message : 'Failed to send OTP', 400);
        }
    }

    async resetPassword(c: Context) {
        try {
            const data = c.get('validatedData');
            const result = await authService.resetPassword(data);
            return successResponse(c, result, 'Password reset successful');
        } catch (error) {
            return errorResponse(
                c,
                error instanceof Error ? error.message : 'Failed to reset password',
                400
            );
        }
    }
}