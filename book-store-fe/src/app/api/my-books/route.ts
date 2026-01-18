import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const cookieStore = request.cookies;
  const token = cookieStore.get(AUTH_COOKIE_NAME);

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const response = await fetch(`${API_URL}/books/me/list?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('My books API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch your books' },
      { status: 500 },
    );
  }
}
