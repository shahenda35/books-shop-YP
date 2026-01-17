import { Hono } from 'hono';
import { BooksController } from './books.controller';

import { CreateBookSchema, UpdateBookSchema } from './books.validation';
import { authMiddleware ,  } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';

const booksController = new BooksController();
const booksRouter = new Hono();

booksRouter.use('*', authMiddleware);

booksRouter.get('/', (c) => booksController.list(c));
booksRouter.get('/me/list', (c) => booksController.myBooks(c));
booksRouter.get('/:id', (c) => booksController.get(c));
booksRouter.post('/', validateRequest(CreateBookSchema), (c) => booksController.create(c));
booksRouter.put('/:id', validateRequest(UpdateBookSchema), (c) => booksController.update(c));
booksRouter.delete('/:id', (c) => booksController.delete(c));

export default booksRouter;
