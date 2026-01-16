import { Hono } from 'hono';
import { authMiddleware } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { ProfileController } from './profile.controller';
import { ChangePasswordSchema, UpdateProfileSchema } from './profile.validation';

const profileController = new ProfileController();
const profileRouter = new Hono();

profileRouter.use('*', authMiddleware);

profileRouter.get('/', (c) => profileController.getProfile(c));
profileRouter.put('/', validateRequest(UpdateProfileSchema), (c) => profileController.updateProfile(c));
profileRouter.put('/change-password', validateRequest(ChangePasswordSchema), (c) => profileController.changePassword(c));

export default profileRouter;
