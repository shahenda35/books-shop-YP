import { Hono } from 'hono';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validation';
import { authMiddleware } from '../../middlewares/auth';
import {
    loginSchema,
    registerSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
} from './auth.validation';

const auth = new Hono();
const authController = new AuthController();

auth.post('/login', validateRequest(loginSchema), (c) => authController.login(c));
auth.post('/register', validateRequest(registerSchema), (c) => authController.register(c));
auth.post('/logout', authMiddleware, (c) => authController.logout(c));
auth.post('/forget-password', validateRequest(forgetPasswordSchema), (c) =>
    authController.forgetPassword(c)
);
auth.post('/reset-password', validateRequest(resetPasswordSchema), (c) =>
    authController.resetPassword(c)
);

export default auth;