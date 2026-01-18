import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) 
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!ALLOWED_TYPES.includes(file.type)) 
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    
    if (file.size > MAX_FILE_SIZE) 
      return { success: false, error: 'File size exceeds 5MB limit.' };

    const buffer = await file.arrayBuffer();

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, Buffer.from(buffer));

    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    const url = `${BASE_URL}/uploads/${filename}`;

    return { success: true, url };
  } catch (error) {
    console.error('Upload service error:', error);
    return { success: false, error: 'Failed to save image' };
  }
}
