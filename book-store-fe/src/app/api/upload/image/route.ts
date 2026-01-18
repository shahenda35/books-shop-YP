import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) 
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME);

    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const uploadUrl = `${BACKEND_URL}/upload/image`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token.value}` : '',
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Backend upload error:', error);
      return NextResponse.json(
        { success: false, error: error.error || 'Upload failed' },
        { status: response.status }
      );
    }
    const result = await response.json();

    if (!result.url) 
      return NextResponse.json(
        { success: false, error: 'Invalid upload response' },
        { status: 500 }
      );
    

    return NextResponse.json({
      success: true,
      url: result.url,
    });

  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
