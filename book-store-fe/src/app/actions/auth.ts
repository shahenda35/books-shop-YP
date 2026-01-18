'use server';

import { login as authLogin, logout as authLogout, updateUser, getUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const identifier = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const user = await authLogin(identifier, password);

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return { success: false, error: message };
  }
}

export async function logout() {
  try {
    await authLogout();
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return { success: false, error: message };
  }
}

export async function updateProfile(data: { fullName: string; email: string }) {
  const user = await updateUser(data);

  if (!user) 
    return { success: false, error: 'Failed to update profile' };

  revalidatePath('/profile');
  return { success: true, user };
}

export async function getCurrentUser() {
  return await getUser();
}
