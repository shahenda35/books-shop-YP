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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: book
      ? {
          title: book.title,
          description: book.description || '',
          price: book.price,
          thumbnail: book.thumbnail || '',
          authorId: book.authorId ?? 0,
          categoryId: book.categoryId ?? 0,
          tagIds: book.tags?.map((t) => t.id || 0) || [],
        }
      : {
          title: '',
          description: '',
          price: 0,
          thumbnail: '',
          authorId: 0,
          categoryId: 0,
          tagIds: [],
        },
  });

  // Load authors and categories from backend
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [authorsRes, categoriesRes] = await Promise.all([
          apiClient.get('/api/authors'),
          apiClient.get('/api/categories'),
        ]);
        setAuthors(authorsRes.data.data || authorsRes.data);
        setCategories(categoriesRes.data.data || categoriesRes.data);
      } catch {
        showToast('Failed to load form metadata', 'error');
      }
    };
    loadMeta();
  }, [showToast]);

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
        router.push('/my-books');
      }
    } catch {
      showToast('Failed to save book', 'error');
    }
  };

  const authorOptions = authors.map((a) => ({ value: String(a.id), label: a.name }));
  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New Book' : 'Edit Book'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Title *"
              placeholder="Enter book title"
              error={errors.title?.message}
              {...register('title')}
            />

            <Select
              label="Author *"
              options={authorOptions}
              error={errors.authorId?.message}
              {...register('authorId', { valueAsNumber: true })}
            />

            <div />

            <Input
              label="Price *"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />

            <Select
              label="Category *"
              options={categoryOptions}
              error={errors.categoryId?.message}
              {...register('categoryId', { valueAsNumber: true })}
            />

            <div />

            <div className="md:col-span-2">
              <Input
                label="Thumbnail URL"
                placeholder="https://example.com/image.jpg"
                error={errors.thumbnail?.message}
                {...register('thumbnail')}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                placeholder="Enter book description"
                rows={4}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </div>

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
              {mode === 'create' ? 'Create Book' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
