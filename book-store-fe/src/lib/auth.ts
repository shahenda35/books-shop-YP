import { cookies } from 'next/headers';
import { User } from '@/types';
import { AUTH_COOKIE_NAME, USER_COOKIE_NAME, STATIC_USER } from './constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const STATIC_MODE = process.env.NEXT_PUBLIC_STATIC_MODE === 'true';

export async function login(email: string, password: string): Promise<User | null> {
  try {
    // If in static mode, use static credentials
    if (STATIC_MODE) {
      if (email === STATIC_USER.email && password === STATIC_USER.password) {
        const mockToken = Buffer.from(JSON.stringify({ 
          userId: STATIC_USER.id, 
          email: STATIC_USER.email,
          timestamp: Date.now() 
        })).toString('base64');

        const user: User = {
          id: STATIC_USER.id,
          name: STATIC_USER.name,
          email: STATIC_USER.email,
        };

        const cookieStore = await cookies();
        cookieStore.set(AUTH_COOKIE_NAME, mockToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });

        cookieStore.set(USER_COOKIE_NAME, JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });

        return user;
      }
      return null;
    }

    // Otherwise, use real backend authentication
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    const token: string = result.data?.token || result.token;
    const userPayload = result.data?.user || result.user;

    if (!token || !userPayload) {
      return null;
    }

    const user: User = {
      id: String(userPayload.id),
      name: userPayload.fullName || userPayload.username || userPayload.email,
      email: userPayload.email,
    };

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set(USER_COOKIE_NAME, JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function logout() {
  if (!STATIC_MODE) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_COOKIE_NAME);

      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(USER_COOKIE_NAME);
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_NAME);
  const userData = cookieStore.get(USER_COOKIE_NAME);

  if (!authToken || !userData) {
    return null;
  }

  try {
    return JSON.parse(userData.value);
  } catch {
    return null;
  }
}

export async function updateUser(data: { fullName?: string; email?: string }): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME);

    if (!token) return null;

    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) return null;

    const result = await response.json();
    const updatedUser: User = {
      id: String(result.data.id),
      name: result.data.fullName ,
      email: result.data.email,
    };

    cookieStore.set(USER_COOKIE_NAME, JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return updatedUser;
  } catch (error) {
    console.error('Update user error:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_NAME);
  return !!authToken;
}

export async function changePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<{ message: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME);

    if (!token) return null;

    const response = await fetch(`${API_URL}/profile/change-password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.data || { message: 'Password changed successfully' };
  } catch (error) {
    console.error('Change password error:', error);
    return null;
  }
}
