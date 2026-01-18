'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { updateProfile, getCurrentUser } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';
import { profileSchema } from '@/lib/validation';
import { ProfileFormData } from '@/types';

export default function EditProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        setValue('fullName', user.name);
        setValue('email', user.email);
      }
      setIsLoading(false);
    };
    loadUser();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data);
      if (result.success) {
        showToast('Profile updated successfully!', 'success');
        router.push('/profile');
      } else 
        showToast(result.error || 'Failed to update profile', 'error');
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  if (isLoading) 
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loading size="lg" />
      </div>
    );
  

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
