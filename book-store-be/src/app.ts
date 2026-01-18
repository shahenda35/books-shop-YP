import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './modules/auth/auth.routes';
import booksRouter from './modules/books/books.routes';
import profileRouter from './modules/profile/profile.routes';
import categoriesRouter from './modules/categories/categories.routes';
import authorsRouter from './modules/authors/authors.routes';


export const app = new Hono();

// Enable CORS for frontend
app.use('/*', cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.route('/api/auth', authRoutes);
app.route('/api/profile', profileRouter);
app.route('/api/books', booksRouter);
app.route('/api/categories', categoriesRouter);
app.route('/api/authors', authorsRouter);
