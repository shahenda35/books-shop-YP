'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
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
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['my-books'] });
        router.push('/my-books');
      } else if (book) {
        const result = await updateBook(String(book.id), data);
        if (result?.success === false) {
          showToast(result.error || 'Failed to save book', 'error');
          return;
        }
        showToast('Book updated successfully!', 'success');
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['my-books'] });
        queryClient.invalidateQueries({ queryKey: ['book', String(book.id)] });
        router.push('/my-books');
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

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.url) 
        throw new Error(result?.error || 'Upload failed');
      

      setValue('thumbnail', result.url, {
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

              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <p className="text-center">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          Click to upload
                        </span>
                        <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
                      </p>
                    </label>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      PNG, JPG, GIF or WebP (max 5MB)
                    </p>
                    
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files?.[0])}
                      className="hidden"
                      disabled={uploading}
                    />
                    
                    <p className="text-xs text-gray-400 mt-3 italic">
                      The thumbnail URL will be generated automatically after upload
                    </p>
                  </div>
                </div>

                {uploading && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <div className="animate-spin">
                      <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-200">Uploading image...</p>
                  </div>
                )}

                {thumbnailUrl && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <svg className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Image uploaded successfully</p>
                      <p className="text-xs text-green-700 dark:text-green-300 break-all mt-1">{thumbnailUrl}</p>
                    </div>
                  </div>
                )}
                
                {errors.thumbnail && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.thumbnail.message}</p>
                )}
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
