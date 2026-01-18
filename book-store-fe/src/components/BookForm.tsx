'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createBook, updateBook } from '@/app/actions/books';
import apiClient from '@/lib/apiClient';
import { bookSchema } from '@/lib/validation';
import { Book, BookFormData } from '@/types';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { useToast } from './ui/Toast';

interface BookFormProps {
  book?: Book;
  mode: 'create' | 'edit';
}

export function BookForm({ book, mode }: BookFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [authors, setAuthors] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    getValues,
    reset,
    register,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      thumbnail: '',
      authorId: 0,
      categoryId: 0,
      tagIds: [],
    },
  });

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        description: book.description || '',
        price: book.price,
        thumbnail: book.thumbnail || '',
        authorId: book.authorId ?? 0,
        categoryId: book.categoryId ?? 0,
        tagIds: book.tags?.map((t) => t.id || 0) || [],
      });
    }
  }, [book, reset]);

  const thumbnailUrl = watch('thumbnail');
  const authorIdValue = watch('authorId');
  const categoryIdValue = watch('categoryId');
  const priceValue = watch('price');

  useEffect(() => {
    let isMounted = true;

    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        setMetaError(null);

        const [authorsRes, categoriesRes] = await Promise.all([
          apiClient.get('/api/authors'),
          apiClient.get('/api/categories'),
        ]);

        if (!isMounted) return;

        const authorsData = authorsRes.data.data || authorsRes.data || [];
        const categoriesData = categoriesRes.data.data || categoriesRes.data || [];

        setAuthors(authorsData);
        setCategories(categoriesData);

        const currentAuthorId = getValues('authorId');
        const currentCategoryId = getValues('categoryId');

        if (!book && currentAuthorId === 0 && authorsData.length > 0) 
          setValue('authorId', authorsData[0].id);
        

        if (!book && currentCategoryId === 0 && categoriesData.length > 0) 
          setValue('categoryId', categoriesData[0].id);
        

        setLoadingMeta(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load metadata:', err);
        setMetaError('Failed to load authors and categories');
        showToast('Failed to load form options', 'error');
        setLoadingMeta(false);
      }
    };

    loadMeta();

    return () => {
      isMounted = false;
    };
  }, [showToast, book, setValue, getValues]);

  const onSubmit = async (data: BookFormData) => {
    try {
      if (mode === 'create') {
        const result = await createBook(data);
        if (result?.success === false) {
          showToast(result.error || 'Failed to save book', 'error');
          return;
        }
        showToast('Book created successfully!', 'success');
        router.push('/my-books');
      } else if (book) {
        const result = await updateBook(String(book.id), data);
        if (result?.success === false) {
          showToast(result.error || 'Failed to save book', 'error');
          return;
        }
        showToast('Book updated successfully!', 'success');
        router.refresh();
        setTimeout(() => router.push('/my-books'), 500);
      }
    } catch {
      showToast('Failed to save book', 'error');
    }
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      showToast('Image upload is not configured. Please set Cloudinary env vars.', 'error');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.secure_url) {
        throw new Error(result?.error?.message || 'Upload failed');
      }

      setValue('thumbnail', result.secure_url, {
        shouldValidate: true,
        shouldDirty: true,
      });

      showToast('Image uploaded successfully', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      showToast(message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const authorOptions = authors.map((a) => ({
    value: String(a.id),
    label: a.name,
  }));

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New Book' : 'Edit Book'}</CardTitle>
      </CardHeader>
      <CardContent>
        {metaError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-400">
            {metaError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Title *"
              placeholder="Enter book title"
              error={errors.title?.message}
              value={watch('title') || ''}
              onChange={(e) =>
                setValue('title', e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />

            <Select
              label="Author *"
              options={authorOptions}
              error={errors.authorId?.message}
              value={authorIdValue ? String(authorIdValue) : ''}
              onChange={(e) =>
                setValue('authorId', Number(e.target.value), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              disabled={loadingMeta || authorOptions.length === 0}
            />

            <Input
              label="Price *"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              error={errors.price?.message}
              value={String(priceValue ?? '')}
              onChange={(e) => {
                const value = e.target.value;
                setValue('price', value === '' ? 0 : parseFloat(value), {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />

            <Select
              label="Category *"
              options={categoryOptions}
              error={errors.categoryId?.message}
              value={categoryIdValue ? String(categoryIdValue) : ''}
              onChange={(e) =>
                setValue('categoryId', Number(e.target.value), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              disabled={loadingMeta || categoryOptions.length === 0}
            />

            <div />

            <div className="md:col-span-2 space-y-3">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                Cover Image
              </label>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Input
                  label="Thumbnail URL"
                  placeholder="https://example.com/image.jpg"
                  error={errors.thumbnail?.message}
                  value={thumbnailUrl || ''}
                  onChange={(e) =>
                    setValue('thumbnail', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />

                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="text-sm"
                    disabled={uploading}
                  />
                  <p className="text-xs text-gray-500">
                    {uploading ? 'Uploading...' : 'Upload to Cloudinary (max 5MB)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                placeholder="Enter book description"
                rows={4}
                error={errors.description?.message}
                value={watch('description') || ''}
                onChange={(e) =>
                  setValue('description', e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting || loadingMeta}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={loadingMeta || metaError !== null}
            >
              {mode === 'create' ? 'Create Book' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
