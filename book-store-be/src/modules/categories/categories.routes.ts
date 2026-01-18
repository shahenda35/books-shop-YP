import { Hono } from 'hono';
import { CategoriesController } from './categories.controller';
import { authMiddleware } from '../../middlewares/auth';

const categoriesController = new CategoriesController();
const categoriesRouter = new Hono();

categoriesRouter.get('/', authMiddleware, (c) => categoriesController.list(c));

export default categoriesRouter;
