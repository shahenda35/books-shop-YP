import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as fs from 'fs';
import * as path from 'path';
import authRoutes from './modules/auth/auth.routes';
import booksRouter from './modules/books/books.routes';
import profileRouter from './modules/profile/profile.routes';
import categoriesRouter from './modules/categories/categories.routes';
import authorsRouter from './modules/authors/authors.routes';
import uploadRouter from './modules/upload/upload.routes';


export const app = new Hono();

app.use('/*', cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.get('/uploads/:filename', (c) => {
  const filename = c.req.param('filename');
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
  
  if (!filepath.startsWith(path.join(process.cwd(), 'public', 'uploads'))) 
    return c.text('Not found', 404);
  
  
  if (fs.existsSync(filepath)) {
    const data = fs.readFileSync(filepath);
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    return c.body(data, 200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    });
  }
  
  return c.text('Not found', 404);
});

app.route('/api/auth', authRoutes);
app.route('/api/profile', profileRouter);
app.route('/api/books', booksRouter);
app.route('/api/categories', categoriesRouter);
app.route('/api/authors', authorsRouter);
app.route('/api/upload', uploadRouter);
