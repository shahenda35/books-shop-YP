import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) 
      return NextResponse.json({ user: null }, { status: 200 });
    

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
