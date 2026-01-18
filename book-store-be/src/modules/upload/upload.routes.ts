import { Hono } from 'hono';
import { authMiddleware } from '../../middlewares/auth';
import { uploadImage } from './upload.service';

const uploadRouter = new Hono();

uploadRouter.post('/image', authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) 
      return c.json({ success: false, error: 'No file provided' }, 400);
    
    const result = await uploadImage(file);
    
    if (!result.success) 
      return c.json({ success: false, error: result.error }, 400);
    
    return c.json({ success: true, url: result.url });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ success: false, error: 'Failed to upload image' }, 500);
  }
});

export default uploadRouter;
