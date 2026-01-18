'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/auth';
import { BookFormData } from '@/types';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function createBook(data: BookFormData) {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);

  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token.value}` : '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to create book' };
    }

    revalidatePath('/books');
    revalidatePath('/my-books');

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create book';
    return { success: false, error: message };
  }
}

export async function updateBook(id: string, data: BookFormData) {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);

  try {
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token.value}` : '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to update book' };
    }

    revalidatePath('/books');
    revalidatePath('/my-books');
    revalidatePath(`/books/${id}`);

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update book';
    return { success: false, error: message };
  }
}
