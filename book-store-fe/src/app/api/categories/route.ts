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

    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token.value}` : '',
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Categories API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
