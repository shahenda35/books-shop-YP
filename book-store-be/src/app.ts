import { Hono } from 'hono';
import authRoutes from './modules/auth/auth.routes';
import booksRouter from './modules/books/books.routes';
import profileRouter from './modules/profile/profile.routes';


export const app = new Hono();

app.route('/api/auth', authRoutes);
app.route('/api/profile', profileRouter);
app.route('/api/books', booksRouter);
