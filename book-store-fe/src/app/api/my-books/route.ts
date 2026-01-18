import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { AUTH_COOKIE_NAME, STATIC_BOOKS } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const STATIC_MODE = process.env.NEXT_PUBLIC_STATIC_MODE === 'true';

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
    if (STATIC_MODE) {
      const searchParams = request.nextUrl.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '8');
      const sort = searchParams.get('sort') || 'asc';

      const books = [...STATIC_BOOKS];

      books.sort((a, b) => {
        if (sort === 'desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedBooks = books.slice(start, end);

      return NextResponse.json({
        success: true,
        data: paginatedBooks,
        pagination: {
          page,
          limit,
          total: books.length,
          pages: Math.ceil(books.length / limit),
        },
      });
    }

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
