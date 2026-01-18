import { Hono } from 'hono';
import { AuthorsController } from './authors.controller';
import { authMiddleware } from '../../middlewares/auth';

const authorsController = new AuthorsController();
const authorsRouter = new Hono();

authorsRouter.get('/', authMiddleware, (c) => authorsController.list(c));

export default authorsRouter;
